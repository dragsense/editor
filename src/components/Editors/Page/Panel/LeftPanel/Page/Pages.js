
import { fetcher } from "../../../../../../lib/fetch";

import PageList from "./PageList";
import { Alert, Button } from 'antd';
import { useEffect, useReducer, useState } from "react";
import ThemeServices from '../../../../../../lib/services/theme';


const initial = {
    pages: [],
    page: null,
    total: 0,
    error: '',
    loading: false
}

const LIMIT = 10;


const reducer = (state, action) => {

    const deleteTemplate = () => {
        let index = state.pages.findIndex(template => template._id === action.id);
        if (index !== -1) {
            state.pages.splice(index, 1);
        }
    }

    const updateTemplate = () => {
        let index = state.pages.findIndex(template => template._id === action.template._id);
        if (index !== -1) {
            state.pages[index] = action.template;
        }
    }

    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return {
                ...state, pages: action.data, total: action.total,
                error: ''
            }
        case "delete":
            deleteTemplate();
            return {
                ...state, pages: [...state.pages], total: state.total - 1,
                error: ''
            }

            case "update":
                updateTemplate();
                return {
                    ...state, pages: [...state.pages],
                    error: ''
                }
        case "error":
            return { ...state, error: action.error }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};

export function Pages({ type, selectedPage, onEdit }) {

    const [state, dispatch] = useReducer(reducer, initial);
    const [page, setPage] = useState(1);


    const laod = async () => {

        if(type === 'template')
        return;


        try {

            dispatch({ type: 'start' });

            const response = await window.autocode.makeApiRequest();


            const project = response.project;
            const url = project.url + `/${type}s/?limit=${LIMIT}&page=${page}`;
            const apikey = project.apikey;
            const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');



            const res = await fetcher(`${sanitizedUrl}`, {
                method: 'Get',
                headers: { 'x-api-key': apikey },
            });


            if (res[type + 's']) {
                const pages = res[type + 's'];
                const data = Array.isArray(pages.results) ? pages.results : [];
                dispatch({ type: 'load', data, total: pages.totalResults });
            }



        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {

            dispatch({ type: 'finish' });

        }
    }

    useEffect( () => {
        laod();

    }, [page]);


    const onDelete = async (id) => {

        try {
            dispatch({ type: 'start' });

            await ThemeServices.deleteTemplate(id);

            dispatch({ type: 'delete', id });

            if (selectedPage?._id == id)
                onEdit(null, '');



        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            dispatch({ type: 'finish' });
        }

    }



    async function onUpdateTemplte(template) {

        try {
            dispatch({ type: 'update', template });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {

        }

    }



    return <div style={{ padding: 5, width: 200 }}>

        {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}
        {type === 'template' && <Alert message={"Comming Soon"} style={{ margin: '10px 0' }} type="info" showIcon closable />}


        <PageList
            selectedPage={selectedPage}
            state={state}
            onDelete={onDelete}
            onEdit={onEdit}
            type={type}
        />


        <div style={{textAlign: 'center', margin: 10}}>

        {state.total > (page * LIMIT) && <Button disabled={state.loading} loading={state.loading} onClick={(e) => {
            e.preventDefault();
            setPage(page + 1);
        }}> Load More </Button>}

</div>

    </div>

};



