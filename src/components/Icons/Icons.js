// Importing necessary components and services
import IconsList from './IconsList';
import AddIcons from './Add';
import { Button, Spin, Divider, message, Input } from 'antd';
import ThemeServices from "../../lib/services/theme";
import { useEffect, useReducer, useCallback, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';

// Initial state for the icons
const initial = {
    icons: [],
    single: null,
    total: 0,
    loading: false
}

// Initial state for a single icon
const initialIcon = {
    _uid: -1,
    name: '',
    classes: '',
    svg: '',
}

// Limit for the number of icons to fetch
const LIMIT = 25;

// Reducer function to handle state changes
const reducer = (state, action) => {
    // Function to update a single icon
    const updateSingle = () => {
        let index = state.icons.findIndex(single => single._uid === action.single?._uid);
        if (index !== -1) {
            state.icons[index] = action.single;
        }
    }

    // Function to delete a single icon
    const deleteSingle = () => {
        let index = state.icons.findIndex(single => single._uid === action._uid);
        if (index !== -1) {
            state.icons.splice(index, 1);
        }
    }

    // Switch case to handle different actions
    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return { ...state, icons: [...state.icons, ...action.data], total: action.total }
        case "searchLoad":
            return { ...state, icons: action.data, total: action.total }
        case "add":
            return { ...state, icons: [...state.icons, action.single], total: state.total + 1 }
        case "edit":
            return { ...state, single: action.data }
        case "close":
            return { ...state, single: null }
        case "update":
            updateSingle();
            return { ...state, icons: [...state.icons], total: state.total }
        case "delete":
            deleteSingle();
            return { ...state, icons: [...state.icons], total: state.total - 1 }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};

// Main Icons component
export default function Icons({ editor, onSelect }) {
    // State for search query
    const [searchQuery, setSearchQuery] = useState('');

    // Using reducer for state management
    const [state, dispatch] = useReducer(reducer, initial);
    // State for page number
    const [page, setPage] = useState(1);

    // Function to load icons
    const load = useCallback(async () => {
        try {
            dispatch({ type: 'start' });
            const res = await ThemeServices.getIcons(page, LIMIT);
            if (res.icons) {
                const data = Array.isArray(res.icons.data) ? res.icons.data : [];
                dispatch({ type: 'load', data, total: res.icons.total || 0 });
            }
        } catch (e) {
            message.error(e?.message || 'Something went wrong.');
        } finally {
            dispatch({ type: 'finish' });
        }
    }, [page]);

    // Effect to load or search icons
    useEffect(() => {
        if (!searchQuery) {
            load();
        } else {
            searchIcons();
        }
    }, [page, searchQuery, load]);

    // Function to search icons
    const searchIcons = useCallback(async () => {
        try {
            dispatch({ type: 'start' });
            const res = await ThemeServices.searchIcons(searchQuery);
            if (res.icons) {
                const data = Array.isArray(res.icons.data) ? res.icons.data : [];
                dispatch({ type: 'searchLoad', data, total: res.icons.total || 0 });
            }
        } catch (e) {
            message.error(e?.message || 'Something went wrong.');
        } finally {
            dispatch({ type: 'finish' });
        }
    }, [searchQuery]);

    // Function to add a new icon
    const onAdd = () => {
        dispatch({ type: 'edit', data: { ...initialIcon } });
    };

    // Function to edit an existing icon
    const onEdit = (single) => {
        dispatch({ type: 'edit', data: single });
    };

    // Function to submit changes
    const onSubmit = useCallback(async (states) => {
        dispatch({ type: 'start' });
        let status = false;
        try {
            const single = state.single;
            let res;
            if (single._uid !== -1)
                res = await ThemeServices.updateIcon(single._uid, states);
            else
                res = await ThemeServices.addIcon(states);
            dispatch({ type: single._uid !== -1 ? 'update' : 'add', single: res.icon });
            status = true;
            dispatch({ type: 'close' });
        } catch (e) {
            message.error(e?.message || 'Something went wrong.');
        } finally {
            dispatch({ type: 'finish' });
            return status;
        }
    }, [state.single]);

    // Function to delete an icon
    const onDelete = useCallback(async (_uid) => {
        dispatch({ type: 'start' });
        try {
            await ThemeServices.deleteIcon(_uid)
            dispatch({ type: 'delete', _uid });
        } catch (e) {
            message.error(e?.message || 'Something went wrong.');
        } finally {
            dispatch({ type: 'finish' });
        }
    }, []);

    // Function to handle search query change
    const onChange = (e) => {
        if (!state.loading)
            setSearchQuery(e.target.value)
    }

    // Render
    return <div style={{ textAlign: 'center' }}>
        <Button icon={<UploadOutlined size="5rem" />} onClick={onAdd}></Button>
        <Divider />
        <Input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={onChange}
        />
        <Divider />
        <div style={{ }}>
            <Spin tip="Loading" size="small" spinning={state.loading}>
                <IconsList
                    editor={editor}
                    setPage={setPage}
                    icons={state.icons}
                    onDelete={onDelete}
                    onSelect={onSelect}
                    onEdit={onEdit}
                />
            </Spin>
        </div>
        <Divider />
        {state.total > (page * LIMIT) && <Button disabled={state.loading} loading={state.loading} onClick={(e) => {
            e.preventDefault();
            setPage(page + 1);
        }}> Load More </Button>}
        <AddIcons
            onSubmit={onSubmit}
            icon={state.single}
        />
    </div>
};
