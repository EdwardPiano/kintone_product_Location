/* eslint-disable no-inner-declarations */
import React, { useEffect, useState } from 'react'
import { Select } from 'antd'
import constants from '../reference/constants'
import kintoneAPI from '../reference/kintoneAPI'

function WareHouse({ getData }) {
  // 下拉選單的選項
  const [options, setOptions] = useState([])

  // 依照輸入的值，篩選選項
  const filterOption = (input, option) => {
    return (option?.label ?? '').includes(input)
  }

  const onChange = (value) => {
    // 將值傳給父組件
    getData(value)
  }
  useEffect(() => {
    async function getAppFields() {
      try {
        const resp = await kintoneAPI.getFormFields(kintoneAPI.tokenRight, constants.RPODUCT_APPID)
        const dropDownOptions = Object.keys(resp.properties['商品所在位置'].options).map((option) => {
          return resp.properties['商品所在位置'].options[`${option}`].label
        })
        dropDownOptions.sort() // 更變排列順序
        setOptions(dropDownOptions)
      } catch (error) {
        constants.showNotification('error', '下拉選單發生錯誤', error.message)
      }
    }
    getAppFields()
  }, [])

  return (
    <>
      {' '}
      <Select
        showSearch
        placeholder="更新商品位置"
        optionFilterProp="children"
        onChange={onChange}
        filterOption={filterOption}
        options={options.map((option) => {
          return {
            value: option,
            label: option,
          }
        })}
      />
    </>
  )
}

export default WareHouse
