# iCatch
## An admin powered by angularjs + bootstrap + flask.
## &copy; HOOHOOLAB

# Environment
## For centos6.5+
    ### Ref: https://gist.github.com/dalegaspi/dec44117fa5e7597a559

操作步骤如下：

1）安装devtoolset

yum groupinstall "Development tools"
2）安装编译Python需要的包包

yum install zlib-devel
yum install bzip2-devel
yum install openssl-devel
yum install ncurses-devel
yum install sqlite-devel
3）下载并解压Python 2.7.9的源代码

cd /opt
#wget --no-check-certificate https://www.python.org/ftp/python/2.7.9/Python-2.7.9.tar.xz
wget --no-check-certificate https://www.python.org/ftp/python/2.7.12/Python-2.7.12.tar.xz
tar xf Python-2.7.12.tar.xz
cd Python-2.7.12
4）编译与安装Python 2.7.9

./configure --prefix=/usr/local
make && make altinstall
5）将python命令指向Python 2.7.9

ln -s /usr/local/bin/python2.7 /usr/local/bin/python
6）检查Python版本

sh
sh-4.1# python -V
Python 2.7.9

wget –no-check-certificate ‘https://pypi.python.org/packages/source/s/setuptools/setuptools-0.7.2.tar.gz’
tar -xvf setuptools-0.7.2.tar.gz
cd setuptools-0.7.2
python2.7 setup.py install –prefix=/usr/local/python2.7

mkdir -p /opt/sensors/
mkdir -p /opt/upload/profiles/


wget --no-check-certificate https://bootstrap.pypa.io/ez_setup.py
python ez_setup.py --insecure

tar -xvf pip-8.1.2.tar.gz
cd pip-8.1.2
python setup.py install --prefix=/usr/local

python `which pip` install flask
pip uninstall jinja2

yum install redis
yum install nginx



service mysqld stop
yum remove mysql mysql-*
yum list installed | grep mysql
yum remove mysql-libs
rpm -Uvh http://repo.mysql.com/mysql-community-release-el6-5.noarch.rpm
yum install -y mysql-community-server


update mysql.user set password = password ('hoohoo123lab') where user = 'root';
delete from mysql.user where user='';
flush privileges;

【参考资料】

Installing python 2.7 on centos 6.3

## git@github.com:mobishift2011/htAdmin.git
## cd ht_admin
## pip install -r scripts/requirements.txt

# Run
## source env.sh
## Admin
### python manager.py runserver
## Data Sync
### python server.py
### python client.py
