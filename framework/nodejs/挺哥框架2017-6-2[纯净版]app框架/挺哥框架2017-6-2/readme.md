== 接下来开发的功能 ==
- 开发可复用模块， js和css的

== 开发思想 ==
- 模块化开发， 可复用性
- 接口方式开发，api开发，灵活性以及可扩展性


== 开发流程 ==
1、文档整理，每个人的开发按照规范来，文档的开发尽量人性化
2、业务逻辑的讨论以及需求的定位， 必须有一个标准
3、开发环境的搭建
4、时间的评估


== 别人的意见 ==
*开发的时间里面比较难的地方*
- 业务流程
- 分析别的网站，看看其他网站有哪些网站模块，业务逻辑是比较好用的，拿来用

== collection ==
- 收集一些不错的网站，并且整理动效库
- 不同的ui
- 不同的业务需求


== 对app框架的理解 ==
*机制原理*
- app框架的形式采用了一个obj的超全局变量，可以把每一个页面上的方法放到obj这个超全局变量，并且压缩所有页面放到mian.js这个文件里面。
*页面结构*
```
    <style id="CSS" type="text/css"></style>

    <script>
         var index = {
            H:177,//滚动高度
            P:'',//该参数为该页面返回上一个页面的名称 如：P：'index'; 进入brand返回上一层为index
            U:"",
            Init:function()
            {
                //第一次加载触发
            },
            _Init:function()
            {
                //第二加载触发
            },
            Logout:function()//退出时进行操作
            {

            },
            // 每次进行一次点击事件，在结束后需要加上obj.RunEnd();
            return:function(obj)//点击返回上一页面
            {
                togoback(obj);
                obj.RunEnd();
            },
            open: function(obj) {
                alert(1);
                var page = obj.parms.page;
                alert("difosdf");
                alert(page);
                switch(page) {
                    case "personalCenter":
                        Open(page);
                        break;
                    case "disease":
                            Open(page);
                        break;
                    default:
                        obj.RunEnd();
                }
            }
        }
    </script>
```


== 问题总结 ==
1、如果是scroll页面的话，内层需要加入一个div
2、app的css的样式不能够重叠，并且命名不能够一样，需要有一个全局的变量。reset写一次就可以了
3、公用的代码
4、手机的兼容性，比如calc可以用吗

== 参考 ==
1、大中医
2、用药助手


== 需求分析 ==
1、需要思考有什么人在用这个app
2、需要考虑到用户体验，用的比较顺畅，操作简便
3、体现科学性，简单易用性，医学性

== 用户产品分析 ==

== 需求 ==
-  增加comment
- 增加

== 需要讨论的 ==

diseaseDetail这个页面只需要传入 ·diseaseDetailData· 就可以
后台传入参数判断
在输出模板的时候需要判断后台是否有值
为空处理
判断未登录
查询语句需要修改


