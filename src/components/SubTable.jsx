/* eslint-disable array-callback-return */
/* eslint-disable camelcase */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
import React, { useState, useRef, useEffect } from 'react'
import { Table, Input, Button } from 'antd'
import kintoneAPI from '../reference/kintoneAPI'
import constants from '../reference/constants'

const initialData = [
  {
    key: '1',
    Code: '',
    Marketing_Name: '',
    PLocation: '',
  },
]

function SubTable({ getData }) {
  const [data, setData] = useState(initialData) // 需呈現的數據
  const [nextKey, setNextKey] = useState(2) // 每一行的key(因為初始資料已經有1了，所以從2開始)
  const [focusLastRow, setFocusLastRow] = useState(false)
  const [tablePage, setTablePage] = useState(1) // 當前表格顯示哪頁(預設從第一頁)
  const inputRef = useRef(null)

  // 處理input框的change事件
  const handleCodeChange = (e, record) => {
    const newData = [...data] // 解構當前數據
    const index = newData.findIndex((item) => item.key === record.key) // 獲取被修改的table index
    const item = newData[index] // 獲取被修改的哪個object
    newData.splice(index, 1, { ...item, Code: e.target.value }) // 刪除原本的值，塞新的進去
    setData(newData) // 重新設定值
  }

  // 處理input框的Enter事件
  const handlePressEnter = async (e, record) => {
    try {
      const query = `Product_Code = "${e.target.value}"`
      const resp = await kintoneAPI.getRecords(kintoneAPI.userRight, constants.RPODUCT_APPID, query)
      if (resp.totalCount === '0') {
        throw new Error(`Product_Code:["${e.target.value}"]不存在，請檢查產品資料`)
      }
      const newData = [...data]
      const index = newData.findIndex((item) => item.key === record.key)
      const { Product_Code, Marketing_Name, Location } = resp.records[0]
      const newItem = {
        Code: Product_Code.value,
        Marketing_Name: Marketing_Name.value,
        PLocation: Location.value,
      }
      newData.splice(index, 1, { ...record, ...newItem })
      // 將所有的Code回傳給父組件
      getData(
        newData.reduce((result, cur) => {
          if (cur.Code) {
            result.push(cur.Code)
          }
          return result
        }, []),
      )
      setData([...newData, { key: `${nextKey}`, Code: '', Marketing_Name: '', PLocation: '' }]) // 重新設定值
      setNextKey(nextKey + 1)
      setFocusLastRow(true)
      setTablePage(Math.ceil((data.length + 1) / 10))
    } catch (error) {
      constants.showNotification('warning', '表格發生錯誤', error.message)
    }
  }

  // 處裡刪除行
  const handleDelete = (key) => {
    console.log('Delete')
    const newData = data.filter((item) => {
      return item.key !== key
    })
    setData(newData)
    setTablePage(Math.ceil(data.length / 10))
    // 將所有的Code回傳給父組件
    getData(
      newData.reduce((result, cur) => {
        if (cur.Code) {
          result.push(cur.Code)
        }
        return result
      }, []),
    )
  }

  // 監聽data變化，如果有變化，就將滑鼠指定到追加的那行
  useEffect(() => {
    if (focusLastRow && inputRef.current) {
      inputRef.current.focus()
      // 以防修改input也執行所以設定setFocusLastRow為false
      setFocusLastRow(false)
    }
  }, [focusLastRow, data])

  const columns = [
    {
      title: 'Product Code',
      dataIndex: 'Code',
      render: (text, record) => {
        return (
          <Input
            placeholder="Product Code"
            value={text}
            onChange={(e) => {
              handleCodeChange(e, record)
            }}
            onPressEnter={(e) => {
              handlePressEnter(e, record)
            }}
            ref={record.key === `${nextKey - 1}` ? inputRef : null}
          />
        )
      },
    },
    {
      title: 'Marketing Name',
      dataIndex: 'Marketing_Name',
      editable: true,
    },
    {
      title: 'Location',
      dataIndex: 'PLocation',
      editable: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Button
          type="primary"
          danger
          onClick={() => {
            handleDelete(record.key)
          }}
        >
          刪除
        </Button>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{
        current: tablePage,
        pageSize: 10,
        position: ['bottomCenter'],
        // 點擊頁數切換頁面時
        onChange: (page) => {
          setTablePage(page)
        },
      }}
    />
  )
}

export default SubTable
