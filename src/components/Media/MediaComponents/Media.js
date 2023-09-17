import MediaList from './MediaList';
import AddMedia from './Add';
import UplaodComponent from './Upload';
import { Button, Spin, Divider, message, Input } from 'antd';
import MediaServices from "../../../lib/services/media";
import { useEffect, useReducer, useCallback, useState } from "react";
import { debounce } from '../../../lib/utils';

// Initial state for the reducer
const initialState = {
    media: [],
    single: null,
    total: 0,
    loading: false
};

const LIMIT = 25;

// Reducer for handling media-related actions
const mediaReducer = (state, action) => {
    switch (action.type) {
        case "start":
            return { ...state, loading: true };
        // Loading and SearchLoading cases combined for cleaner code
        case "load":
        case "searchLoad":
            return { ...state, media: action.data, total: action.total, loading: false };
        case "add":
            return { ...state, media: [action.data, ...state.media], total: state.total + 1 };
        case "edit":
            return { ...state, single: action.data };
        case "close":
            return { ...state, single: null };
        case "update":
            const updatedMedia = state.media.map(item => item._id === action.single._id ? action.single : item);
            return { ...state, media: updatedMedia };
        case "delete":
            const filteredMedia = state.media.filter(item => item._id !== action.id);
            return { ...state, media: filteredMedia, total: state.total - 1 };
        case "finish":
            return { ...state, loading: false };
        default:
            return state;
    }
};

// Main component for Media handling
export default function Media({ type, srcs, onSelect }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [state, dispatch] = useReducer(mediaReducer, initialState);
    const [page, setPage] = useState(1);

    // Function to load media data from API
    const loadMedia = useCallback(async () => {
        dispatch({ type: 'start' });
        try {
            const res = await MediaServices.getAll(type, page, LIMIT);
            const data = Array.isArray(res.media.results) ? res.media.results : [];
            dispatch({ type: 'load', data, total: res.media.totalResults });
        } catch (e) {
            message.error(e?.message || 'Something went wrong.');
        } finally {
            dispatch({ type: 'finish' });
        }
    }, [type, page]);

    // Function to handle media search
    const handleSearch = useCallback(async () => {
        dispatch({ type: 'start' });
        try {
            const res = await MediaServices.search(type, searchQuery);
            const data = Array.isArray(res.media.results) ? res.media.results : [];
            dispatch({ type: 'searchLoad', data, total: res.media.totalResults });
        } catch (e) {
            message.error(e?.message || 'Something went wrong.');
        } finally {
            dispatch({ type: 'finish' });
        }
    }, [type, searchQuery]);

    // Load more media when the page number increases
    useEffect(() => {
        if (page > 1) {
            loadMedia();
        }
    }, [page, loadMedia]);

    // Reload media list when type or search query changes
    useEffect(() => {
        if (searchQuery) {
            handleSearch();
        } else {
            loadMedia();
        }
    }, [type, searchQuery, handleSearch, loadMedia]);


     // Function to add a new media entry
     const onAdd = (single) => {
        dispatch({ type: 'add', data: single });
    };

    // Function to edit an existing media entry
    const onEdit = (single) => {
        dispatch({ type: 'edit', data: single });
    };

    // Function to submit changes to a media entry
    const onSubmit = async (mediaData) => {
        dispatch({ type: 'start' });
        try {
            const res = await MediaServices.update(state.single._id, mediaData);
            dispatch({ type: 'update', single: res.media });
            dispatch({ type: 'close' });
            return true; // Indicating a successful submission
        } catch (e) {
            message.error(e?.message || 'Something went wrong.');
            return false; // Indicating an error occurred
        } finally {
            dispatch({ type: 'finish' });
        }
    };

    // Function to delete a media entry
    const onDelete = async (id) => {
        dispatch({ type: 'start' });
        try {
            await MediaServices.delete(id);
            dispatch({ type: 'delete', id });
        } catch (e) {
            message.error(e?.message || 'Something went wrong.');
        } finally {
            dispatch({ type: 'finish' });
        }
    };

    // Function to handle changes in the search input
    const handleInputChange = (e) => {
        if (!state.loading) {
            setSearchQuery(e.target.value);
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <UplaodComponent type={type} onAdd={onAdd} />
            <Divider />
            <Input
                type="text"
                placeholder="Search media..."
                value={searchQuery}
                onChange={handleInputChange}
            />
            <Divider />
            <Spin tip="Loading" size="small" spinning={state.loading}>
                <MediaList
                    setPage={setPage}
                    media={state.media}
                    onDelete={onDelete}
                    onSelect={onSelect}
                    onEdit={onEdit}
                    srcs={srcs}
                    type={type}
                />
            </Spin>
            <Divider />
            {state.total > (page * LIMIT) && 
                <Button disabled={state.loading} loading={state.loading} onClick={() => setPage(page + 1)}> 
                    Load More 
                </Button>
            }
            <AddMedia onSubmit={onSubmit} media={state.single} />
        </div>
    );
}