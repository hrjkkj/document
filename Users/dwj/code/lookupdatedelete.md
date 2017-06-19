 //点击查看
    function hello1(obj){
        var $div = obj.parentNode;
        var _id = $div.children[0].value;
        var title = $div.children[1].value;
        var name = $div.children[2].value;
        var text = $div.children[3].value;
        document.forms[0].title.value = title;
        document.forms[0].name.value = name;
        document.forms[0].text.value = text;
        document.forms[0]._id.value = _id;
        var data ="_id="+_id
                +"&title="+encodeURIComponent(title)
                +"&name="+encodeURIComponent(name)
                +"&text="+encodeURIComponent(text);

        Tajax.send("post","getArticleMethod", "data", function (obj) {
            try {
                var data = JSON.parse(obj.Text)
            } catch (e) {
                console.log(e);
            }
            if(data) {
                data.contentdata = data;
            }
        }, 10000);
    }

    //查询
    data();
    function data() {
        var data = document.getElementById("data");
        var form = document.forms[0];
        var title = form.title.value;
        var name = form.name.value;
        var text = form.text.value;
        var data =
                "title="+encodeURIComponent(title)
                +"&name="+encodeURIComponent(name)
                +"&text="+encodeURIComponent(text);
        Tajax.send("post","getArticleMethod", "data", function (obj) {
            try {
                var data = JSON.parse(obj.Text)
            } catch (e) {
                console.log(e);
            }
            if(data) {
                data.contentdata = data;
            }
        }, 10000);
    };
   //修改
        var updateArticle = document.getElementById("updateArticle");
        updateArticle.onclick= function(){
        var isupdate = confirm("确定修改文章吗？");
        if(isupdate) {
            var form = document.forms[0];
            var title = form.title.value;
            var name = form.name.value;
            var text = form.text.value;
            var _id = form._id.value;

            //判断空
            if(title == "") {
                alert("标题不能为空");
            } else if(name == "") {
                alert("作者不能为空");
            } else if(text == "") {
                alert("内容不能为空");
            }else {
                var datas = "_id="+_id
                        +"&title=" + encodeURIComponent(title)
                        + "&name=" + encodeURIComponent(name)
                        + "&text=" + encodeURIComponent(text);

                Tajax.send("post", "updateArticleMethod", datas, function (obj1) {
                    alert(obj1.Text);
                }, 10000);
            }
        }
    }

    //删除

    var deleteArticle = document.getElementById("deleteArticle");
    deleteArticle.onclick= function(){
        var isdelete = confirm("确定删除文章吗？");
        if(isdelete) {
            var form = document.forms[0];
            var title = form.title.value;
            var name = form.name.value;
            var text = form.text.value;
            var _id = form._id.value;
                var datas = "_id="+_id
                        +"&title=" + encodeURIComponent(title)
                        + "&name=" + encodeURIComponent(name)
                        + "&text=" + encodeURIComponent(text);

                Tajax.send("post", "deleteArticleMethod", datas, function (obj1) {
                    alert(obj1.Text);
                }, 10000);
        }
    }
