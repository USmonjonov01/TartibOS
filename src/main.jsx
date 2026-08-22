import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Root from './root'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, App as AntdApp } from 'antd'
import { antdTheme } from './theme/antdTheme'
import { UserProvider } from './context/users'
import { RoutineProvider } from './context/routine'
import { WeeksProvider } from './context/weaks'
import { MessagesProvider } from './context/messages'
import { NotificationsProvider } from './context/notifications'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ConfigProvider — antd komponentlarini (Statistics'dagi Card/Progress/
        Statistic, endi esa message/notification toastlari ham) TartibOS'ning
        "Balandlik jurnali" mavzusiga moslaydi. AntdApp — antd v5+ tavsiya
        qilingan static-emas message/notification context'ini beradi, shu
        sabab MessagesProvider/NotificationsProvider undan ichkarida turishi shart. */}
    <ConfigProvider theme={antdTheme}>
      <AntdApp>
        <BrowserRouter>
          <UserProvider>
            <RoutineProvider>
              <WeeksProvider>
                <MessagesProvider>
                  <NotificationsProvider>
                    <Root />
                  </NotificationsProvider>
                </MessagesProvider>
              </WeeksProvider>
            </RoutineProvider>
          </UserProvider>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
)
