exports.Welcome = {
    file: "index.html"
};
exports.Expires = {
    fileMatch: /^(gif|png|jpg|js|css)$/ig,
    maxAge: 60
};
exports.Path = {
    qtPORT:30002,//前台端口
    //静态文件路径
    dir: "fqjhd_admin/static/a",
    entryName:"fqjhd_admin",//项目名称
    command_path:"./reception",//后端文件路径
    command_path1:"/reception",//后端文件路径
    urla:"mongodb://fqjhd:ta52d14y9@127.0.0.1:27017/fqjhd",//数据库配置
    url_name:"父亲节活动",//网站名称
    ejspath:"static/a/*.ejs",//管理ejs路径
};
