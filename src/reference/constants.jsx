import { notification } from 'antd'
import './constants.css'

export default class constants {
  static RPODUCT_APPID = 2151

  static RPODUCT_TOKEN = 'YY0Jj1B7B8PrmFgbDmeutOpzysSkEDCM7opXLhDf'

  static showNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: 'bottomRight',
      duration: 3,
      style: { width: 560 },
    })
  }
}
