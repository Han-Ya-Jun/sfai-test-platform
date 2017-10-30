from flask import Flask, render_template
import logging, argparse
from app.resource import resource

app = Flask(__name__, template_folder='templates/pages',  # 指定模板路径，可以是相对路径，也可以是绝对路径。
            static_folder='static',  # 指定静态文件前缀，默认静态文件路径同前缀
            )

app.register_blueprint(resource, url_prefix='/resource')  # 注册resource蓝图，并指定前缀。。


def init():
    parser = argparse.ArgumentParser()
    parser.add_argument('--mysql', type=str,
                        default="localhost,3306,root,1234")
    args = parser.parse_args()
    return args


@app.route('/')
def dds():
    return render_template('index.html')


if __name__ == '__main__':
    args = init()
    logging.basicConfig(
        level=logging.DEBUG,
        format='%(asctime)s %(levelname)s %(message)s',
        datefmt='%a, %d %b %Y %H:%M:%S',
        filename='logs/pro.log',
        filemode='w')
    logging.info("daily-report server start")
    app.run(host="0.0.0.0")
