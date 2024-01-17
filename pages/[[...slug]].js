import {useContext, useEffect, useRef, useState} from "react";
import {styled, createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuItemList from 'components/MenuItemList';
import MenuContent from "components/MenuContent";
import Image from "next/image";
import {promises as fs} from 'fs';
import path from 'path';
import documentsdata from '/data/documents.json';
import nextConfig from 'next.config';
import {RouterContext} from "./_app";
import {Autocomplete, Backdrop, CircularProgress, InputAdornment, TextField} from "@mui/material";
import TagIcon from '@mui/icons-material/Tag';
import SearchIcon from '@mui/icons-material/Search';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href={`${nextConfig?.basePath || ''}/`}>
                {nextConfig?.env?.title || 'My Document'}
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Home({content}) {
    // 设置页面路由切换时 内容组件滚动到顶部
    const contentAreaRef = useRef(null);
    const scrollToTop = () => {
        if (contentAreaRef.current) {
            contentAreaRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    };

    const router = useContext(RouterContext);
    const [selectedSlug, setSelectedSlug] = useState(router.query.slug);

    // 当URL的slug参数发生变化时更新选择的slug
    useEffect(() => {
        setSelectedSlug(router.query.slug);
    }, [router.query.slug]);

    // 路由切换时，订阅路由变化时的开始、完成事件，处理loading显示
    const [pageLoading, setPageLoading] = useState(false);
    useEffect(() => {
        const handleRouteChangeStart = (url, {shallow}) => {
            setPageLoading(true);
        }
        const handleRouteChangeComplete = (url, {shallow}) => {
            scrollToTop();
            setPageLoading(false);
        }

        router.events.on('routeChangeStart', handleRouteChangeStart);
        router.events.on('routeChangeComplete', handleRouteChangeComplete);

        // If the component is unmounted, unsubscribe
        // from the event with the `off` method:
        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
        }
    }, [router]);

    const [selectedMenuItem, setSelectedMenuItem] = useState(selectedSlug ?
        documentsdata.find(item => item.key === selectedSlug[0]) || documentsdata[0] :
        documentsdata[0]
    );

    const [selectedSearchOption, setSelectedSearchOption] = useState("");
    const [searchInputValue, setSearchInputValue] = useState("");

    /**
     * 转换菜单列表中的标签为搜索框下拉列表标签选项
     * 如果未配置标签，则默认以title为标签
     */
    const searchOptions = documentsdata.reduce((result, item) => {
        if (item.tags) {
            item.tags.forEach(tag => {
                result.push({label: tag, doc_key: item.key});
            });
        } else {
            result.push({label: item.label, doc_key: item.key});
        }
        return result;
    }, []);

    /*处理下拉列表标签选中事件*/
    const handleOptionClick = (event, value, reason) => {
        setSelectedSearchOption(value);
        if (reason === 'selectOption') {
            setSelectedMenuItem(documentsdata.find(item => item.key === value.doc_key));
            router.push(`/${value.doc_key}`);
        }
    };

    /*用于确定选项是否代表给定值*/
    const handleOptionEqualToValue = (option, value) => {
        return !value || (option.label === value.label && option.doc_key === value.doc_key);
    };

    const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && {display: 'none'}),
                            }}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{
                                flexGrow: 1,
                                textOverflow: 'ellipsis',
                                oTextOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                            }}
                            fontWeight="bold"
                        >
                            {selectedMenuItem.label}
                        </Typography>
                        <Autocomplete
                            disablePortal
                            value={selectedSearchOption}
                            onChange={handleOptionClick}
                            inputValue={searchInputValue}
                            onInputChange={(event, value) => {
                                setSearchInputValue(value);
                            }}
                            isOptionEqualToValue={handleOptionEqualToValue}
                            options={searchOptions}
                            getOptionLabel={(option) => option ? option.label : ''}
                            renderOption={(props, option) => (
                                <li {...props} style={{display: 'flex', alignItems: 'center', gap: '8px',}}>
                                    <TagIcon fontSize='small' color='primary'/>
                                    <Typography>{option.label}</Typography>
                                </li>
                            )}
                            size='medium'
                            sx={{
                                width: 265, 
                                marginRight: 2,
                                [defaultTheme.breakpoints.down('sm')]: {
                                    display: 'none',
                                },
                            }}
                            blurOnSelect={true}
                            renderInput={(params) =>
                                <TextField {...params}
                                           variant="standard"
                                           placeholder="Search by tag"
                                           InputProps={{
                                               ...params.InputProps,
                                               startAdornment: (
                                                   <InputAdornment position="start">
                                                       <SearchIcon fontSize='small'/>
                                                   </InputAdornment>
                                               )
                                           }}
                                />
                            }
                        />
                    </Toolbar>
                </AppBar>
                <Drawer 
                    variant="permanent" 
                    open={open} 
                    sx={{
                        ...(!open && {
                            margin: 0,
                            display: 'none',
                        })
                    }}
                >
                    <Backdrop
                        open={pageLoading}
                        invisible={true}
                        sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                        <CircularProgress
                            variant="indeterminate"
                            disableShrink={false}
                            sx={{
                                color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                            }}
                            size={80}
                            thickness={3}
                        />
                    </Backdrop>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1,}}>
                            <Image src={`${nextConfig?.basePath || ''}/favicon.ico`}
                                   alt={`${nextConfig?.env?.title || 'My Document'}`} width={40} height={40}/>
                            <Typography variant="h6" fontWeight="bold" color="#1976d2">
                                {nextConfig?.env?.title || 'My Document'}
                            </Typography>
                        </Box>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </Toolbar>
                    <Divider/>
                    <List component="nav" 
                        sx={{
                            maxHeight: '85vh', 
                            overflowY: 'auto',
                            overflowX: 'hidden',
                        }}
                    >
                        <MenuItemList
                            items={documentsdata}
                            selectedItem={selectedMenuItem}
                            onSelectItem={item => {
                                setSelectedMenuItem(item);
                                setSelectedSearchOption("");
                                setSearchInputValue("");
                            }}
                            router={router}
                            open={open}
                        />
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar/>
                    <Container maxWidth="lg" sx={{mt: 0.5, mb: 0.5}} disableGutters>
                        <Grid container spacing={3} ref={contentAreaRef}>
                            {/* menu content of selected */}
                            <Grid item xs={12}>
                                <Paper
                                    sx={{p: 2, display: 'flex', flexDirection: 'column',}}>
                                    <MenuContent content={content}/>
                                    <Copyright sx={{mt: 2}}/>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export async function getStaticPaths() {
    const markdownDirectory = path.join(process.cwd(), 'markdown');
    const filenames = await fs.readdir(markdownDirectory);

    // 从文件名列表生成所有可能的路径
    const paths = filenames.map((filename) => {
        const menuItem = documentsdata.find(item => item.label === filename.replace('.md', ''));
        const key = menuItem ? menuItem.key : documentsdata[0].key;
        return {
            params: {slug: [key]},
        };
    });

    // 手动添加首页路径
    paths.push({
        params: {slug: ['']},
    });

    return {paths, fallback: false};
}

export async function getStaticProps({params}) {
    // 判断slug参数是否为空（访问首页）
    const pageSlug = params?.slug ? params.slug[0] : documentsdata[0].key;
    const {label: fileName} = documentsdata.find(item => item.key === pageSlug) || documentsdata[0];

    const markdownDirectory = path.join(process.cwd(), 'markdown');
    const filePath = path.join(markdownDirectory, `${fileName}.md`);
    const fileContent = await fs.readFile(filePath, 'utf-8');

    return {props: {content: fileContent}};
}