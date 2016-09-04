insert into `configvalue` (`title`, `type`, `value`) values
('timezone', 'timezone', 'UTC'),
('profile', 'profile', '默认'),
('fileHash', 'fileHash', 'md5'),
('quarantineMessage', 'quarantine', ''),
('quarantineWhitelist', 'quarantine', '');

insert into `profile` (`title`, `description`, `addedBy_id`, `dateAdded`, `deleted`)
values ('默认', '系统默认', (select id from user limit 1), now(), 0);