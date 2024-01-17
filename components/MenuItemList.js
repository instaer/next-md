import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArticleIcon from "@mui/icons-material/Article";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

export default function MenuItemList({items, selectedItem, onSelectItem, router}) {
    const handleListItemClick = (item) => {
        onSelectItem(item);
        router.push(`/${item.key}`);
    };

    return (
        <>
            {
                items.map(item => (
                    <ListItemButton
                        onClick={() => handleListItemClick(item)}
                        selected={item.key === selectedItem.key}
                        key={item.key}
                    >
                        <ListItemIcon>
                            {item.key === 'example-doc' ? <TipsAndUpdatesIcon/> : <ArticleIcon/>}
                        </ListItemIcon>
                        <ListItemText primary={item.label} sx={{overflow: 'hidden'}}/>
                    </ListItemButton>
                ))
            }
        </>
    );
}