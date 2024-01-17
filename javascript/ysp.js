const cookieName = '央视频'
const signurlKey = 'senku_signurl_ysp'
const signheaderKey = 'senku_signheader_ysp'
const signbodyKey = 'senku_signbody_ysp'
const senku = init()
const signurlVal = senku.getdata(signurlKey)
const signheaderVal = senku.getdata(signheaderKey)
const signBodyVal = senku.getdata(signbodyKey)
// 基础地址url
const baseUrl = "https://h5access.yangshipin.cn"
// 任务列表url
const taskListUrl = "/web/point_task_list_auth"
// 做任务url
const doTaskUrl = "/web/point_task_do_auth"

// 签到
// sign()

// 获取任务列表
getTaskList()


function sign() {
 const cookie = JSON.parse(signheaderVal).Cookie
 if (!cookie) {
   senku.msg(`cookie已失效,请重新获取`)
   senku.done()
 }
  const url = { url: signurlVal, headers: JSON.parse(signheaderVal), body: signBodyVal }
  senku.get(url, (error, response, data) => {
    const result = JSON.parse(data)
    if (result.success) {
      subTitle = `签到结果: 成功`
      detail= `获得${result.data.credits}积分，已连续签到${result.data.signResult}天`
    } else {
      subTitle = `签到结果: 失败` 
    }
    senku.msg(cookieName, subTitle, detail)
    senku.done()
  })
}

function getTaskList() {
  const url = {
    // url: baseUrl + taskListUrl,
    url: 'https://h5access.yangshipin.cn/web/point_task_list_auth',
    headers: JSON.parse(signheaderVal), 
    body: signBodyVal
  }
  senku.get(url, (error, response, data) => {
    console.log('getTaskList1: ', data);
    const result = JSON.parse(data)
    console.log('getTaskList2: ', result);
    if (result === 200) {

    }
  })
}

// 做任务
function doTask(taskId) {
  const url = {
    url: baseUrl + doTaskUrl,
    headers: JSON.parse(signheaderVal), 
    body: signBodyVal
  }
  senku.post(url, (error, response, data) => {
    const result = JSON.parse(data)
    console.log('result: ', result);
    if (result === 200) {

    }
  })
}

function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
