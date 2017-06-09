//自定义indexedDB框架  
//黄伟军..
	
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction || window.msIDBTransaction;

window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.msIDBKeyRange;

(function (window){ 

	//设置严格模式 
	"use strict";

	var db = { 

		version: 1,//版本

		objectStoreName: 'test',

		member: {},//用来保存打开数据库之后的返回成员实例对象

		upgradeneeded: function(e) { 

			var dbobj = e.target.result;

			var tableName = db.objectStoreName;

			if(!dbobj.objectStoreNames.contains(tableName)){ 
				dbobj.createObjectStore(tableName,{keyPath:'id',autoIncrement:true});
			}


		},

		//自定义错误处理
		errorHandler: function(error) { 
			window.alert('程序错误!'+error.target.code);
			//调试模式
			debugger;
		},

		open: function(callback) { 

			var result = window.indexedDB.open(db.objectStoreName,db.version);

			result.onerror = db.errorHandler;

			result.onupgradeneeded = db.upgradeneeded;

			result.onsuccess = function(e) { 

				//将结果对象赋值给自定义member方法
				db.member = e.target.result;
				//出错则交给错误处理机制 
				db.member.onerror = db.errorHandler;
				//调用回调
				callback();

			} 


		},

		//获取数据对象 
		getObjectStore: function(mode) { 

			var txn,store;

			mode = mode || 'readonly';

			txn = db.member.transaction([db.objectStoreName],mode);

			store = txn.objectStore(db.objectStoreName);

			return store;
		},


		//具体操作 增删改查
		//插入或者修改数据 
		ins_update: function(data, callback) { 

			db.open(function() { 

				var store,request,mode = 'readwrite';
				
				store = db.getObjectStore(mode);

				//判断用户是添加操作还是删除操作 
				request = data.id ? store.put(data) : store.add(data);

				request.onsuccess = callback;

			});
		},

	};


	window.myApp = window.myApp || {};

	window.myApp.db = db;


})(window)

