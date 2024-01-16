const cookieName = '三喜生活'
const signurlKey = 'senku_signurl_sxsh'
const signheaderKey = 'senku_signheader_sxsh'
const signbodyKey = 'senku_signbody_sxsh'
const senku = init()
const signurlVal = senku.getdata(signurlKey)
const signheaderVal = senku.getdata(signheaderKey)
const signBodyVal = senku.getdata(signbodyKey)

sign()

function sign() {
 const cookie = JSON.parse(signheaderVal).token
 if (!cookie) {
   senku.msg(`cookie已失效,请重新获取`)
   senku.done()
 }
  const url = { url: signurlVal, headers: JSON.parse(signheaderVal), body: signBodyVal }
  senku.post(url, (error, response, data) => {
    const result = JSON.parse(data)
    // const total = result.data['task.revisionSignInGetAward'].total
    // const ret = result.data['task.revisionSignInGetAward'].ret
    let subTitle = ``
    let detail = ``
    let sec_tk = ``
    let sec_tkNum = ``
    let red_packet = ``
    let red_packetNum = ``
    let pri_tk = ``
    let pri_tkNum = ``
    let integral = ``
    let integralNum = ``
    // if (total != 0) {
    //   const num = result.data['task.revisionSignInGetAward'].awards[0].num
    //   subTitle = `签到结果: 成功`
    //   detail = `获得鲜花: ${num}朵,已连续签到:${total}天`
    // } else if (ret == -11532) {
    //   subTitle = `签到结果: 成功 (重复签到)`
    // } else {
    //   subTitle = `签到结果: 失败`
    // }
    if (result.code === 200) {
      subTitle = `签到结果: 成功`
      const awardList = result.data.awardList
      awardList.forEach( item => {
        if (item.awardType === 'sec_tk') {
          sec_tk = `商城子通证`
          sec_tkNum = item.awardNum
        } else if (item.awardType === 'red_packet') {
          red_packet = `商城红包`
          red_packetNum = item.awardNum
        } else if (item.awardType === 'pri_tk') {
          pri_tk = `商城主通证`
          pri_tkNum = item.awardNum
        } else {
          integral = `喜豆`
          integralNum = item.awardNum
        }
      })
      detail= `获得${sec_tk}${sec_tkNum}${red_packet}${parseFloat(parseFloat(red_packetNum / 100).toFixed(2))}${pri_tk}${pri_tkNum}${integral}${parseFloat(parseFloat(integralNum / 100).toFixed(2))}`
    } else if (result.code === 400 || result.message === '今日已签到') {
      subTitle = `签到结果: 成功 (重复签到)`
    } else {
      subTitle = `签到结果: 失败` 
    }
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