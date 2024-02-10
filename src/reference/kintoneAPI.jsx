import { KintoneRestAPIClient } from '@kintone/rest-api-client'
import constants from './constants'

export default class kintoneAPI {
  // 登入者權限
  static userRight = new KintoneRestAPIClient()

  // 最高權限者
  static tokenRight = new KintoneRestAPIClient({
    // Use API token authentication
    auth: { apiToken: `${constants.RPODUCT_TOKEN}` },
  })

  // 獲取kintone記錄資料
  static getRecords = async (client, AppId, query) => {
    const resp = await client.record.getRecords({
      app: AppId,
      query,
      totalCount: true,
    })
    return resp
  }

  // 獲取kintone應用程式後台表單設定
  static getFormFields = async (client, AppId) => {
    const resp = await client.app.getFormFields({ app: AppId })
    return resp
  }

  // 更新多筆記錄資料
  static updateAllRecords = async (client, AppId, records) => {
    await client.record.updateAllRecords({
      app: AppId,
      records,
    })
  }
}
