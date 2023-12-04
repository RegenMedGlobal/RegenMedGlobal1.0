import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Article = lazy(() => import('../pages/articles/Article'));
const Articles = lazy(() => import('../pages/articles/Articles'));
const Author = lazy(() => import('../pages/articles/Author'));
const AuthorSignIn = lazy(() => import('../pages/articles/AuthorSignIn'));
const AuthorSignUp = lazy(() => import('../pages/articles/AuthorSignUp'));
const Claim = lazy(() => import('../pages/Claim'));
const CodeValidator = lazy(() => import('../pages/CodeValidator'));
const Contact = lazy(() => import('../pages/Contact'));
const DoctorLogin = lazy(() => import('../pages/DoctorLogin'));
const Logout = lazy(() => import('../pages/Logout'));
const Main = lazy(() => import('../pages/Main'));
const Profile = lazy(() => import('../pages/Profile'));
const Register = lazy(() => import('../pages/Register'));
const ResetAuthorPassword = lazy(() => import('../pages/articles/ResetAuthorPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const Results = lazy(() => import('../pages/Results'));
const Services = lazy(() => import('../pages/Services'));
const SubmitArticle = lazy(() => import('../pages/articles/SubmitArticle'));
const Videos = lazy(() => import('../pages/podcasts/Videos'));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Main />} />
      <Route path='/Services' element={<Services />} />
      <Route path='/home' element={<Main />} />
      <Route path='/Contact' element={<Contact />} />
      <Route path='/Results' element={<Results />} />
      <Route path='/DoctorLogin' element={<DoctorLogin />} />
      <Route path='/Logout' element={<Logout />} />
      <Route path='/Register' element={<Register />} />
      <Route path='/profile/:userId' element={<Profile />} />
      <Route path='/claim' element={<Claim />} />
      <Route path='/articles' element={<Articles />} />
      <Route path="/article/:articleId" element={<Article />} />
      <Route path="/author/:authorId" element={<Author />} />
      <Route path='/submitarticle' element={<SubmitArticle />} />
      <Route path='/authorsignup' element={<AuthorSignUp />} />
      <Route path='/authorsignin' element={<AuthorSignIn />} />
      <Route path='/ResetPassword' element={<ResetPassword />} />
      <Route path='/resetauthorpassword' element={<ResetAuthorPassword />} />
      <Route path='/videos' element={<Videos />} />
      <Route path='/CodeValidator/:id' element={<CodeValidator />} />
    </Routes>
  );
}
