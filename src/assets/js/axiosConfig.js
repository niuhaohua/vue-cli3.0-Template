import axios from 'axios';
import qs from "qs";
import V from '@/main';



// 请求拦截器
axios.interceptors.request.use(
	function (config) {
		return config;
	},
	function (error) {
		return Promise.reject(error)
	}
);


// 响应拦截器
let refresh_token, switcher = 0;
axios.interceptors.response.use(
	(response) => {
		let responseData = response.data;
		if (responseData.code === 401) { // token失效
			if (switcher == 0) {
				if (localStorage.getItem('refreshtoken') == undefined || localStorage.getItem('refreshtoken') == null) {
					V.$router.push('/login');
					return;
				}
				refresh_token = new Promise((resolve, reject) => {
					switcher = 1;
					let url = '/refreshToken',
						client = new XMLHttpRequest(),
						params;
					client.open("post", url);
					client.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
					params = "refresh_token=" + localStorage.getItem('refreshtoken');
					client.send(params);
					client.onreadystatechange = function () {
						if (client.readyState == 4) {
							if (client.status == 200) {
								let response = JSON.parse(client.responseText);
								if (response.code == 200) {
									let datas = response.data,
										token = datas['access_token'],
										refreshtoken = datas['refresh_token'],
										user;
									user = JSON.stringify(datas['user']);
									localStorage.setItem('token', token);
									localStorage.setItem('refreshtoken', refreshtoken);
									localStorage.setItem('user', user);
									switcher = 0;
									resolve("success");
								} else if (response.code == 996) {
									localStorage.removeItem('token');
									localStorage.removeItem('refreshtoken');
									localStorage.removeItem('user');
									reject("fail");
								} else {
									switcher = 0;
									localStorage.removeItem('token');
									localStorage.removeItem('refreshtoken');
									localStorage.removeItem('user');
									V.$router.push('/login');
									reject("fail");
								}
							} else {
								switcher = 0;
								localStorage.removeItem('token');
								localStorage.removeItem('refreshtoken');
								localStorage.removeItem('user');
								V.$router.push('/login');
								reject("fail");
							}
						}
					}
				});
			}

			return refresh_token.then(
				function (data) {
					response.config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
					return axios(response.config);
				},
				function (error) {
					return Promise.reject(error);
				}
			)

		} else if (responseData.code !== 200) {
			// throw new Error(responseData.msg);
			return response;
		} else {
			return response;
		}
	},
	(error) => {
		if (error.response) {
			// 请求已发出，但服务器响应的状态码不在 2xx 范围内
			throw new Error(error.response.data.msg)
		} else {
			// 由于设置请求发生错误而触发的错误
			throw new Error(error.message)
		}
	}
)

/*
 * method: 请求方式get,post
 * url:    请求地址
 * type:   请求类型 0为'application/x-www-form-urlencoded', 1为'application/json', 2为'multipart/form-data'
 * params: 请求参数{key:value}
 * token:  是否需要添加token,true为添加，false为不添加
 */
function ajaxRequest(method, url, type, params, token = false) {
	let contentType = ['application/x-www-form-urlencoded', 'application/json', 'multipart/form-data'],
		headers = {
			'content-type': contentType[type]
		};
	if (token == true) {
		headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
	}
	if (type == 0) {
		params = qs.stringify(params);
	}
	return axios({
		method: method,
		url: url,
		headers: headers,
		data: params
	});
}


export default ajaxRequest;