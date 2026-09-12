import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Root from './root'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, App as AntdApp } from 'antd'
import { getAntdTheme } from './theme/antdTheme'
import { ThemeProvider, useTheme } from './context/theme'
import { UserProvider } from './context/users'
import { RoutineProvider } from './context/routine'
import { WeeksProvider } from './context/weaks'
import { MessagesProvider } from './context/messages'
import { NotificationsProvider } from './context/notifications'
import { GoalProvider } from './context/goals'

// ThemeContext'dagi joriy rejimni (light/dark) o'qib, antd'ning ConfigProvider
// theme'ini shunga moslab qayta hisoblaydi — foydalanuvchi rejimni almashtirganda
// antd komponentlari ham (Statistics sahifasidagi Card/Progress/Statistic va h.k.)
// darhol yangi palitraga o'tadi.
function ThemedApp() {
  const { theme } = useTheme();

  return (
    <ConfigProvider theme={getAntdTheme(theme)}>
      <AntdApp>
        <BrowserRouter>
          <UserProvider>
            <RoutineProvider>
              <WeeksProvider>
                <MessagesProvider>
                  <NotificationsProvider>
                    <GoalProvider>
                      <Root />
                    </GoalProvider>
                  </NotificationsProvider>
                </MessagesProvider>
              </WeeksProvider>
            </RoutineProvider>
          </UserProvider>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  </StrictMode>,
)
