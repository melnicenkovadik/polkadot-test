import {Suspense} from 'react';
import {Route, Link, Outlet, Routes} from "react-router-dom";
import Loader from './Loader';
import {HomePage} from "../HomePage";
import {AddTweet} from "../AddTweet";

function App() {

    return (
        <div className="converter-app">
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={
                        <Suspense fallback={<Loader/>}>
                            <HomePage/>
                        </Suspense>}/>
                    <Route path='add' element={
                        <Suspense fallback={<Loader/>}>
                            <AddTweet/>
                        </Suspense>}/>
                </Route>
            </Routes>
        </div>
    );
}

function Layout() {
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/add">Add Tweet</Link>
                    </li>
                </ul>
                <div>
                    <a href="https://app.subsocial.network/10327" target="_blank">Subsocial</a>
                </div>
            </nav>
            <Outlet/>
        </div>
    );
}

export default App;
