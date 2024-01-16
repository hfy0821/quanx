const cookieName = 'wis'
const signurlKey = 'senku_signurl_wis'
const signheaderKey = 'senku_signheader_wis'
const signbodyKey = 'senku_signbody_wis'
const senku = init()
const signurlVal = senku.getdata(signurlKey)
const signheaderVal = senku.getdata(signheaderKey)
// const signBodyVal = senku.getdata(signbodyKey)

sign()

function sign() {
const cookie = JSON.parse(signheaderVal).Cookie
 if (!cookie) {
     senku.msg(`cookie已失效,请重新获取`)
     senku.done()
 }
  const url = { url: signurlVal, headers: JSON.parse(signheaderVal)/*, body: signBodyVal*/ }
  senku.get(url, (error, response, data) => {
    console.log(data)
    const result = JSON.parse(data)
    console.log(result)
    let subTitle = ``
    let detail = ``
    let integral = ``
    if (result.status === true) {
      subTitle = `签到成功`
      const integral = result.data.integral
      detail= `获得${integral}积分`
    } else if (result.status === false) {
      subTitle = `签到结果: 签到失败或重复签到`
    }
    console.log(cookieName, subTitle, detail)
    senku.msg(cookieName, subTitle, detail)
    senku.done()
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