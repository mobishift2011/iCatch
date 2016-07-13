#-*- encoding: utf-8 -*-
from app.apis import RestResource
from flask import request

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