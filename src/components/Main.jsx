/* eslint-disable func-names */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react'
import { FloatButton, ConfigProvider, Modal, Spin } from 'antd'
import { ScanOutlined } from '@ant-design/icons'
import SubTable from './SubTable'
import WareHouse from './WareHouse'
import constants from '../reference/constants'
import kintoneAPI from '../reference/kintoneAPI'
import './Main.css'

// 一覽按鈕渲染
function Main() {
  const [loading, setLoading] = useState(false) // 是否顯示loading
  const [open, setOpen] = useState(false) // 是否打開彈跳視窗
  const [wareHouse, setWareHouse] = useState(null) // 倉庫的value
  const [ProductCode, setProductCode] = useState([]) // 表格填入的value

  // 開啟彈跳視窗
  const openModal = () => {
    setOpen(true)
  }
  // 關閉彈跳視窗
  const closeModal = () => {
    setOpen(false)
  }
  // 檢查ProductCode有沒有重複
  function hasDuplicates(array) {
    return new Set(array).size !== array.length // Set是一個不可重複的array可以用來檢查有沒有重複
  }
  // 按下確認後處理更新
  const handleStockUpdate = async () => {
    try {
      // 檢查有沒有選擇倉庫
      if (!wareHouse) {
        constants.showNotification('warning', '未指定', '未指定「更新商品位置」')
        return
      }
      if (hasDuplicates(ProductCode)) {
        constants.showNotification('error', 'Product Code', '「Product Code」重複，請檢查表格資料')
        return
      }
      setLoading(true)
      const params = ProductCode.map((productCode) => {
        return {
          updateKey: {
            field: 'Product_Code',
            value: productCode,
          },
          record: {
            商品所在位置: {
              value: wareHouse,
            },
          },
        }
      })
      await kintoneAPI.updateAllRecords(kintoneAPI.userRight, constants.RPODUCT_APPID, params)
      constants.showNotification('success', '更新成功', '「更新商品位置」完成，畫面將自動刷新!')
      // 重新整理
      setTimeout(function () {
        window.location.reload()
      }, 2000)
    } catch (error) {
      constants.showNotification('error', '更新失敗', error.message)
    }
  }
  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            titleFontSize: 26,
          },
        },
      }}
    >
      <FloatButton icon={<ScanOutlined />} onClick={openModal} />
      {loading && (
        <div className="spin-container">
          <Spin size="large" />
        </div>
      )}
      <Modal
        title={<p>設備位置調整</p>}
        open={open}
        width={1300}
        maskClosable={false}
        okText="確認"
        cancelText="取消"
        onCancel={closeModal}
        onOk={handleStockUpdate}
        destroyOnClose
      >
        <WareHouse getData={setWareHouse} />
        <br /> <br />
        <SubTable getData={setProductCode} />
      </Modal>
    </ConfigProvider>
  )
}

export default Main
