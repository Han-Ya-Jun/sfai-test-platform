from flask import render_template
from app.resource import resource
import main


@resource.route('/')  # 指定路由为/，因为run.py中指定了前缀，浏览器访问时，路径为http://IP/asset/
def index():
    ars = main.init()
    print(ars.mysql)
    return render_template('pages/index.html')  # 返回index.html模板，路径默认在templates下
