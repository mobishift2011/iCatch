#-*- encoding: utf-8 -*-
from app.apis import RestResource
from flask_peewee.serializer import Serializer
from flask import request
from peewee import ForeignKeyField

import datetime
import pytz


class BaseResource(RestResource):
    def get_request_metadata(self, paginated_query):
        var = paginated_query.page_var
        request_arguments = request.args.copy()
        current_page = paginated_query.get_page()
        next = previous = ''

        if current_page > 1:
            request_arguments[var] = current_page - 1
            # previous = url_for(self.get_url_name('api_list'), **request_arguments)
        if current_page < paginated_query.get_pages():
            request_arguments[var] = current_page + 1
            # next = url_for(self.get_url_name('api_list'), **request_arguments)

        meta = {}
        total = paginated_query.query.count()
        paginate_by = paginated_query.paginate_by

        meta.update({
            'model': self.get_api_name(),
            'page': current_page,
            # 'previous': previous,
            # 'next': next,

            'total': total,
            'pages': paginated_query.get_pages(),
            'paginate_by': paginate_by,
            'start': (current_page - 1) * paginate_by + 1,
            'end': min(current_page * paginate_by, total),
            'maxPageSize': 5 #The max page num shown on the screen.
        })
        return meta

    def serialize_rawquery_simple(self, query, fields=None):
        s = self.get_serializer()
        if fields is None:
            if isinstance(query, list):
                if query:
                    fields = {query[0]._meta.model_class: query[0]._meta.get_field_names()}
            else:
                fields = {query.model: query.model._meta.get_field_names()}

        return [
            self.prepare_data(obj, s.serialize_object(obj, fields, self._exclude)) \
            for obj in query
        ]

    def serialize_patch_foreignkey(self, result, patch_fields, model=None):
        if not result:
            return

        fk_map = {}
        model = model or self.model
        for field in model._meta.fields.values():
            if isinstance(field, ForeignKeyField):
                if field.rel_model in patch_fields:
                    fk_map[field.name] = [field.rel_model, []]

        for item in result:
            for key in fk_map.keys():
                if key in item:
                    value = item[key]
                    if value is not None:
                        fk_map[key][1].append(value)

        for value in fk_map.values():
            klass = value[0]
            serialize_fields = patch_fields.get(klass)
            serialize_result = self.serialize_rawquery_simple(klass.select().where(klass.id << value[1]), {value[0]: serialize_fields})
            for item in serialize_result:
                item['fk_type'] = 'fk'
            value[1] = {item['id']: item for item in serialize_result}

        for item in result:
            for key, value in fk_map.iteritems():
                if key in item:
                    if type(item[key]) == type(0):
                        item[key] = value[1].get(item[key])


    def get_serializer(self):
        return BaseSerializer()


class BaseSerializer(Serializer):
    def process_timestamp(self, value, tz=None):
        raw_datetime = datetime.datetime.fromtimestamp(value)
        utc_datetime = pytz.utc.localize(raw_datetime)

        if tz is None:
            return utc_datetime

        dest_datetime = utc_datetime.astimezone(pytz.timezone(tz))
        return dest_datetime

    def clean_data(self, data):
        tz = None

        for key, value in data.items():
            if isinstance(value, dict):
                self.clean_data(value)
            elif isinstance(value, (list, tuple)):
                data[key] = map(self.clean_data, value)
            elif key == 'timestamp':
                if not tz:
                    from app.models import ConfigValue
                    tz = ConfigValue.get(title='timezone').value
                if value:
                    data[key] = self.process_timestamp(value, tz = tz).strftime('%Y-%m-%d %H:%M:%S')
            else:
                data[key] = self.convert_value(value)
        return data