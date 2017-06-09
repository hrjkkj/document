
arg.client.collection("table")
//选择table数据库

#### [查询语句]
php: $query = `select * from table where params=${params}'`;
nodejs: var query = arg.client.collection("table").find("params": params);

