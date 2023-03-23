import { systemInfo } from "@/package/request/index/system";
import { useEffect, useState } from "react";
import Gauge from "./Gauge";
import './system.scss'
import { Statistic, Button, Spin } from "antd";
import { ReloadOutlined } from '@ant-design/icons'

type SystemInfo = {
  cpuPercent: number,
  momoryPercent: number,
  totalMemory: number,
  freeMemory: number
}

export default function System() {

  const [info, setInfo] = useState<SystemInfo>()
  const [loading, setLoading] = useState<boolean>(false)

  const loadInfo = () => {
    setLoading(true)
    systemInfo().then((res: SystemInfo) => {
      setLoading(false)
      setInfo(res)
    })
  }

  useEffect(() => {
    loadInfo()
  }, [])

  let color = '#3f8600'
  const percent = (info?.freeMemory || 0) / (info?.totalMemory || 0)
  if (percent < 0.6) {
    color = '#faad14'
  }
  if (percent < 0.3) {
    color = '#cf1422'
  }

  return (
    <Spin spinning={loading}>
      <div className="card">
        <div className="ant-list-header">系统监控</div>
        <div className="index-system-info">
          <Gauge percent={info?.cpuPercent} name="CPU" />
          <Gauge percent={info?.momoryPercent} name="内存" />
          <div className="momory">
            <Statistic
              title="总内存"
              value={info?.totalMemory}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              suffix="GB"
            />
            <Statistic
              title="剩余内存"
              value={info?.freeMemory}
              precision={2}
              valueStyle={{ color: color }}
              suffix="GB"
            />
            <Button type="primary" onClick={loadInfo}><ReloadOutlined />刷新</Button>
          </div>
        </div>
      </div>
    </Spin>
  )
}