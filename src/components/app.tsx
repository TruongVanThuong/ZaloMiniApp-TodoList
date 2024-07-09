import React, { Suspense } from 'react';
import { Route } from 'react-router-dom'
import {
  App,
  ZMPRouter,
  AnimationRoutes,
  SnackbarProvider,
} from 'zmp-ui';
import { RecoilRoot } from 'recoil';
import Info from '../pages/info';
import About from '../pages/about';
import Form from '../pages/form';
import User from '../pages/user';
import Todo from '../pages/Todo';
import TodoCategory from '../pages/TodoCategory';
import TodoDetail from '../pages/TodoDetail';
import CalendarPage from '../pages/Calendar';
import Navigation from './nav';


const MyApp = () => {

  return (
    <RecoilRoot>
      <App >
        <SnackbarProvider>
          <ZMPRouter>
            <AnimationRoutes>
              <Route
                path="/info"
                element={
                  <Suspense fallback={<div>Loading Info...</div>}>
                    <Info />
                  </Suspense>
                }
              />
              <Route path="/" element={<Todo></Todo>}></Route>
              <Route path="/about" element={<About></About>}></Route>
              <Route path="/form" element={<Form></Form>}></Route>
              <Route path="/user" element={<User></User>}></Route>
              <Route path="/todo" element={<Todo></Todo>}></Route>
              <Route path="/todo-category" element={<TodoCategory></TodoCategory>}></Route>
              <Route path="/todo/:id" element={<TodoDetail />}></Route>
              <Route path="/calendar" element={<CalendarPage></CalendarPage>}></Route>
            </AnimationRoutes>
            <Navigation />
          </ZMPRouter>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
}
export default MyApp;