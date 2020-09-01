import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import App from './components/App';

render((
    <DndProvider backend={HTML5Backend}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </DndProvider>
), document.getElementById('root'));
 