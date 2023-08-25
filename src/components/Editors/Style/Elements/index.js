import { AutoComplete } from 'antd';
import React, { useEffect, useState, useRef } from 'react';

// import { satisfy } from '@/lib/utils/satisfy';


// const specialTags = [
//     'br',
//     'col',
//     'colgroup',
//     'dl',
//     'hr',
//     'iframe',
//     'img',
//     'input',
//     'link',
//     'menuitem',
//     'meta',
//     'ol',
//     'param',
//     'select',
//     'table',
//     'tbody',
//     'tfoot',
//     'thead',
//     'tr',
//     'ul',
//     'wbr',
// ];


// const renderChilds = (nodes) => {


//     const nodeList = Array.prototype.slice.call(nodes);


//     const elements = nodeList.map((node) => {

//         switch (node.nodeType) {
//             case 1:
//                 const name = node.nodeName.toLowerCase();
//                 const imgAttributes = name == 'img' ? { src: "/images/default/default-img.png" } : {};
//                 const aAttributes = name == 'a' ? { href: "#" } : {};
//                 const videoAttributes = name == 'video' ? { src: "/videos/birds.mp4", width: 300, height: 300, controls: true } : {};
//                 const childNode = specialTags.indexOf(name) !== -1 ? null : ["Some Text Here", node.childNodes.length ? renderChilds(node.childNodes) : ''];
//                 const attributes = { ...imgAttributes, ...videoAttributes, ...aAttributes }
//                 const nodeClassNames = node.getAttribute('class');
//                 if (nodeClassNames) {
//                     attributes.className = nodeClassNames;
//                 }

//                 for (const att of node.attributes)
//                     attributes[att.name] = att.value;

//                 attributes.class = undefined;

//                 return React.createElement(
//                     name,
//                     { ...attributes },
//                     childNode
//                 );

//             default:
//                 return null;
//         }
//     });

//     return elements;
// }


// export function RenderHtml({ cssSelector }) {


//     const [nodes, setNodes] = useState(null);

//     useEffect(() => {

//         if (!cssSelector)
//             return;

//         const n = satisfy(cssSelector.split(',')[0]);
//         setNodes(n)

//     }, [cssSelector]);



//     return <>{nodes && renderChilds(nodes)}</>
// }

// export function H1({ cssSelector }) {

//     return <h1 id={cssSelector.id} class={cssSelector.class} >This is Heading 1</h1>
// }

// export function H2({ cssSelector }) {
//     return <h2 id={cssSelector.id} class={cssSelector.class}>This is Heading 2</h2>
// }

// export function H3({ cssSelector }) {
//     return <h3 id={cssSelector.id} class={cssSelector.class}>This is Heading 3</h3>
// }

// export function H4({ cssSelector }) {
//     return <h4 id={cssSelector.id} class={cssSelector.class}>This is Heading 4</h4>
// }

// export function H5({ cssSelector }) {
//     return <h5 id={cssSelector.id} class={cssSelector.class}>This is Heading 5</h5>
// }

// export function H6({ cssSelector }) {
//     return <h6 id={cssSelector.id} class={cssSelector.class}>This is Heading 6</h6>
// }

// export function P({ cssSelector }) {
//     return <p id={cssSelector.id} class={cssSelector.class}>This is Paragraph</p>
// }

// export function A({ cssSelector }) {
//     return <a id={cssSelector.id} class={cssSelector.class}>This is Link</a>
// }

// export function Label({ cssSelector }) {
//     return <label id={cssSelector.id} class={cssSelector.class}>This is Label</label>
// }

// export function Input({ cssSelector }) {
//     return <input id={cssSelector.id} class={cssSelector.class} placeholder="This is Input" />
// }

// export function Textarea({ cssSelector }) {
//     return <textarea id={cssSelector.id} class={cssSelector.class}> This is Textarea </textarea>
// }

// export function Submit({ cssSelector }) {
//     return <button id={cssSelector.id} class={cssSelector.class} type="submit">Submit</button>
// }

// export function _Button({ cssSelector }) {
//     return <button id={cssSelector.id} class={cssSelector.class} type="button">Button</button>
// }

// export function Span({ cssSelector }) {
//     return <span id={cssSelector.id} class={cssSelector.class}>This is Span</span>
// }

// export function Div({ cssSelector }) {
//     return <div id={cssSelector.id} class={cssSelector.class}>
//         This is Div
//     </div>
// }


// export function Section({ cssSelector }) {
//     return <section id={cssSelector.id} class={cssSelector.class}>This is Section</section>
// }

// export function _Display({ display }) {


//     const [childs, setChilds] = useState(['', '', '', '', '']);

//     const [index, setIndex] = useState(1);


//     return <>

//         <input type="radio" name="view" checked={1 == index} onChange={() => setIndex(1)} />Parent View
//         &nbsp;
//         <input type="radio" name="view" checked={0 == index} onChange={() => setIndex(!index)} />Child View

//         <hr /><br />
//         {index == 1 ?
//             <div>
//                 <div style={{ ...display, backgroundColor: '#e5e5e5', margin: '2px', padding: '20px', textAlign: 'center' }} >

//                     <div style={{ display: 'inherit', padding: '16px 0', margin: 'auto' }}>Block1</div>

//                 </div>
//                 <span> </span>
//                 <div style={{ ...display, border: '1px dotted rgb(248, 138, 36)', backgroundColor: '#e5e5e5', padding: '20px', margin: '2px', textAlign: 'center' }} >

//                     <div style={{ display: 'inherit', padding: '16px 0', margin: 'auto' }}>Block2</div>
//                 </div>
//                 <span> </span>
//                 <div style={{ ...display, backgroundColor: '#e5e5e5', margin: '2px', padding: '20px', textAlign: 'center' }} >

//                     <div style={{ display: 'inherit', padding: '16px 0', margin: 'auto' }}>Block3</div>
//                 </div>
//             </div> : <>
//                 <ChildsDisplay display={display} index={index} />
//             </>}


//         {/* <div class={cssSelector.class} style={{ resize: "both", overflow: 'auto', maxWidth: '100%' }}>

//             <div style={{ backgroundColor: '#e5e5e5', padding: '20px' }}>Child1</div>
//             <div style={{ backgroundColor: '#e5e5e5', padding: '20px' }}>Child2</div>
//             <div class={cssSelector.class} style={{ display: 'block', backgroundColor: '#e5e5e5', padding: '20px', border: '1px dotted rgb(248, 138, 36)' }}>Child4</div>
//             <div style={{ backgroundColor: '#e5e5e5', padding: '20px' }}>Child3</div>
//             <div style={{ backgroundColor: '#e5e5e5', padding: '20px' }}>Child5</div>
//         </div> */}

//     </>
// }

// export function ChildsDisplay({ display, index }) {

//     const [childs, setChilds] = useState([null, null, display, null, null]);
//     const [type, setType] = useState('flex');

//     const onChange = (i) => {
//         if (childs[i])
//             childs[i] = null
//         else
//             childs[i] = display;

//         setChilds([...childs]);
//     }

//     const onChangeType = (e) => {
//         e.preventDefault();
//         setType(e.target.value);
//     }

//     useEffect(() => {

//         setChilds([...childs.map(c => c ? c = display : null)]);
//     }, [display])


//     const isDisplayType = (display.display === 'flex' || display.display === 'inline-flex' ||
//         display.display === 'grid' || display.display === 'inline-grid');

//     return <>



//         <div style={{ display: 'flex', justifyContent: 'space-between' }}>

//             {!isDisplayType && <select value={type} onChange={onChangeType}>
//                 <option value="flex">Flex</option>
//                 <option value="grid">Grid</option>
//             </select>}

//             <div>
//                 <button onClick={(e) => { e.preventDefault(); setChilds([...childs, '']) }}>
//                     +
//                 </button>

//                 <button onClick={(e) => { e.preventDefault(); childs.pop(); setChilds([...childs]) }}>
//                     -
//                 </button>
//             </div>
//         </div>

//         <hr />
//         {!isDisplayType ? <div style={{ display: type, gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto', justifyContent: 'center', alignItems: 'center', resize: "both", overflow: 'hidden', height: 300, maxHeight: 300, maxWidth: '100%', border: '1px dotted #2fc1ff' }}>

//             {childs.map((v, i) =>
//                 <div onClick={(e) => { e.preventDefault(); onChange(i) }} style={{ ...v, border: v ? '1px dotted rgb(248, 138, 36)' : '', backgroundColor: '#e5e5e5', padding: '20px', cursor: 'pointer' }}>Child {i}</div>
//             )}
//         </div>
//             : <div style={{ ...display, resize: "both", overflow: 'hidden', height: 300, maxHeight: 300, maxWidth: '100%', border: '1px dotted #2fc1ff' }}>

//                 {childs.map((v, i) =>
//                     <div onClick={(e) => { e.preventDefault(); onChange(i) }} style={{ backgroundColor: '#e5e5e5', padding: '20px', cursor: 'pointer' }}>Child {i}</div>
//                 )}
//             </div>}
//     </>
// }


// export function Animation({ animation }) {


//     const [delay, setDelay] = useState(1);
//     const [duration, setDuration] = useState(4);
//     const [timeFun, setTimeFun] = useState('ease');
//     const [direction, setDirection] = useState('normal');
//     const [fillMode, setFillMode] = useState('none');
//     const [playState, setPlayState] = useState('running');


//     const input = `${duration + 's'} ${timeFun} ${delay + 's'} infinite ${direction} ${fillMode} ${playState}  ${animation}`;

//     return animation ? <>
//         <div>

//             <p><b>style:</b> {input}</p>

//             <label>dur: </label>
//             <input type='number' style={{ width: 50 }} value={duration} onChange={(e) => { e.preventDefault(); setDuration(e.target.value) }} />
//             &nbsp; &nbsp;
//             <label>fun: </label>
//             <select style={{ width: 60 }} value={timeFun} onChange={(e) => { e.preventDefault(); setTimeFun(e.target.value) }}>
//                 <option value="linear">linear</option>
//                 <option value="ease">ease</option>
//                 <option value="ease-in">ease-in</option>
//                 <option value="ease-in-out">ease-in-out</option>
//                 <option value="ease-out">ease-out</option>
//                 <option value="cubic-bezier(0.1, -0.6, 0.2, 0)">cubic-bezier(0.1, -0.6, 0.2, 0)</option>
//                 <option value="cubic-bezier(0, 1.1, 0.8, 4)">cubic-bezier(0, 1.1, 0.8, 4)</option>
//                 <option value="steps(3, start)">steps(3, start)</option>
//                 <option value="steps(4)">steps(4)</option>
//             </select>
//             &nbsp; &nbsp;
//             <label>delay: </label>
//             <input type='number' style={{ width: 50 }} value={delay} onChange={(e) => { e.preventDefault(); setDelay(e.target.value) }} />
//             &nbsp; &nbsp;

//             <label>dir: </label>
//             <select style={{ width: 60 }} value={direction} onChange={(e) => { e.preventDefault(); setDirection(e.target.value) }}>
//                 <option value="normal">normal</option>
//                 <option value="reverse">reverse</option>
//                 <option value="alternate">alternate</option>
//                 <option value="alternate-reverse">alternate-reverse</option>
//             </select>
//             &nbsp; &nbsp;
//             <label>mode: </label>
//             <select style={{ width: 60 }} value={fillMode} onChange={(e) => { e.preventDefault(); setFillMode(e.target.value) }}>
//                 <option value="none">none</option>
//                 <option value="forwards">forwards</option>
//                 <option value="backwards">backwards</option>
//                 <option value="both">both</option>
//             </select>
//             &nbsp; &nbsp;
//             <br />
//             <hr />
//             <input type="radio" name="playState" checked={'running' == playState} onChange={() => setPlayState('running')} />Running
//             &nbsp;
//             <input type="radio" name="playState" checked={'paused' == playState} onChange={() => setPlayState('paused')} />Paused


//         </div>
//         <div style={{ display: 'flex', height: 300, justifyContent: 'center', alignItems: 'center' }}>
//             <div style={{ animation: input, background: 'blue', width: 30, height: 30 }}></div>
//         </div>
//     </> : <></>
// }

export const Body = ({ className, style, children }) => {
    return <body style={style} className={className}>
        {children}
    </body>
}

export const Header = ({ className, style, children }) => {
    return <header style={style} className={className}>
        {children}
    </header>
}

export const Nav = ({ className, style, children }) => {
    return <nav style={style} className={className}>
        {children}
    </nav>
}

export const Main = ({ className, style, children }) => {
    return <main style={style} className={className}>
        {children}
    </main>
}


export const Aside = ({ className, style, children }) => {
    return <aside style={style} className={className}>
        {children}
    </aside>
}

export const Section = ({ className, style, children, src }) => {
    return <section className={className}>
        {children}
    </section>
}

export const Article = ({ className, style, children }) => {
    return <article style={style} className={className}>
        {children}
    </article>
}

export const Spacer = ({ className, style, children }) => {
    return <div style={style} className={className}>
        {children}
    </div>
}

export const Hr = ({ className, style, children }) => {
    return <hr style={style} className={className}>
        {children}
    </hr>
}


export const Footer = ({ className, style, children }) => {
    return <footer style={style} className={className}>
        {children}
    </footer>
}

export const H1 = ({ className, style, children }) => {
    return <h1 style={style} className={className}>
        {children}
    </h1>
}

export const H2 = ({ className, style, children }) => {
    return <h2 style={style} className={className}>
        {children}
    </h2>
}

export const H3 = ({ className, style, children }) => {
    return <h3 style={style} className={className}>
        {children}
    </h3>
}

export const H4 = ({ className, style, children }) => {
    return <h4 style={style} className={className}>
        {children}
    </h4>
}

export const H5 = ({ className, style, children }) => {
    return <h5 style={style} className={className}>
        {children}
    </h5>
}

export const H6 = ({ className, style, children }) => {
    return <h6 style={style} className={className}>
        {children}
    </h6>
}

export const P = ({ className, style, children }) => {
    return <p style={style} className={className}>
        {children}
    </p>
}

export const List = ({ className, style, children }) => {
    return <ul style={style} className={className}>
        {children}
    </ul>
}

export const OrderList = ({ className, style, children }) => {
    return <ol style={style} className={className}>
        {children}
    </ol>
}

export const Li = ({ className, style, children }) => {
    return <li style={style} className={className}>
        {children}
    </li>
}

export const A = ({ className, style, children }) => {
    return <a onClick={(e) => e.preventDefault()} style={style} href="#" className={className}>
        {children}
    </a>
}

export const Blockquote = ({ className, style, children }) => {
    return (
        <blockquote style={style} className={className}>
            {children}
        </blockquote>
    );
};

export const Form = ({ className, style, children }) => {
    return (
        <form style={style} className={className}>
            {children}
        </form>
    );
};

export const Label = ({ className, style, children }) => {
    return (
        <label style={style} className={className}>
            {children}
        </label>
    );
};

export const Input = ({ className, style, type, placeholder }) => {
    return <input style={style} className={className} type={type} placeholder={placeholder} />;
};

export const Select = ({ className, style, multiple = false, children }) => {
    return (
        <select multiple={multiple} style={style} className={className}>
            {children}
        </select>
    );
};

export const Textarea = ({ className, style, placeholder, rows }) => {
    return <textarea style={style} className={className} placeholder={placeholder} rows={rows} />;
};

// Visual
export const Img = ({ className, style, src, alt }) => {
    return <img style={style} className={className} src={src} alt={alt} />;
};

export const Background = ({ className, style, children, src }) => {
    return (
        <div style={{ ...style, backgroundImage: `url(${src})`, }} className={className}>
            {children}
        </div>
    );
};

export const Button = ({ className, style, children, onClick }) => {
    return (
        <button style={style} className={className} onClick={onClick}>
            {children}
        </button>
    );
};

export const Video = ({ className, style, src, type, controls }) => {
    return (
        <video style={style} className={className} src={src} type={type} controls={controls}>
            Your browser does not support the video tag.
        </video>
    );
};

export const Audio = ({ className, style, src, type, controls }) => {
    return (
        <audio style={style} className={className} src={src} type={type} controls={controls}>
            Your browser does not support the audio tag.
        </audio>
    );
};

// Table
export const Table = ({ className, style, children }) => {
    return (
        <table style={style} className={className}>
            {children}
        </table>
    );
};

export const Thead = ({ className, style, children }) => {
    return (
        <thead style={style} className={className}>
            {children}
        </thead>
    );
};

export const Th = ({ className, style, children }) => {
    return (
        <th style={style} className={className}>
            {children}
        </th>
    );
};

export const Tbody = ({ className, style, children }) => {
    return (
        <tbody style={style} className={className}>
            {children}
        </tbody>
    );
};

export const Tr = ({ className, style, children }) => {
    return (
        <tr style={style} className={className}>
            {children}
        </tr>
    );
};

export const Td = ({ className, style, children }) => {
    return (
        <td style={style} className={className}>
            {children}
        </td>
    );
};

export const Tfoot = ({ className, style, children }) => {
    return (
        <tfoot style={style} className={className}>
            {children}
        </tfoot>
    );
};

export const Div = ({ className, style, children, onClick }) => {
    return (
        <div onClick={onClick} style={style} className={className}>
            {children}
        </div>
    );
};

export const Span = ({ className, style, children }) => {
    return <span style={style} className={className}>
        {children}
    </span>
}



const style = {
    cursor: 'pointer'
}

export const Structure = ({ className = "", elementType = '' }) => {

    const onSelect = (e, element) => {
    }

    return <>
        <Div onClick={(e) => onSelect(e, 'body')} style={{ cursor: 'pointer',  }} >
            <em style={{ color: `${elementType == 'body' ? '#d67822' : 'initial'}` }}>Body</em>
            <Div style={{ padding: 8, border: `${elementType == 'body' ? '2px solid #d67822' : 'none'}` }}>
                <Body className={elementType == 'body' && className}>


                    <Div onClick={(e) => onSelect(e, 'header')}>
                        <em style={{ color: `${elementType == 'header' ? '#d67822' : 'initial'}` }}>Header</em>
                        <Div style={{ padding: 8, border: `${elementType == 'header' ? '2px solid #d67822' : 'none'}` }}>

                            <Header className={elementType == 'header' && className}>

                                <> <Div onClick={(e) => onSelect(e, 'nav')}>
                                    <em onClick={(e) => onSelect(e, 'nav')} style={{ color: `${elementType == 'nav' ? '#d67822' : 'initial'}` }}>Nav</em>
                                    <Div style={{ padding: 8, border: `${elementType == 'nav' ? '2px solid #d67822' : 'none'}` }}>
                                        <Nav className={elementType == 'nav' && className}>
                                            <Div style={{ display: 'flex', justifyContent: 'space-between' }} >
                                                <Div onClick={(e) => onSelect(e, '.logo-img')}>
                                                    <Div style={{ padding: 8, border: `${elementType == '.logo-img' ? '2px solid #d67822' : 'none'}` }}>

                                                        <Img className={elementType == '.logo-img' && className} src="https://picsum.photos/id/2/80/50" />
                                                    </Div>
                                                </Div>

                            <Div>

                                                    <List style={{ display: 'flex', listStyle: 'none', gap: 10 }}>

                                                        <Li>
                                                            <A href="#">Home</A>
                                                        </Li>
                                                        <Li>
                                                            <A href="#">About</A>
                                                        </Li>
                                                        <Li>
                                                            <A href="#">Contact</A>
                                                        </Li>

                                                    </List>

                                                </Div>
                                            </Div>
                                        </Nav>
                                    </Div>
                                </Div>

                                    <H1 style={{ textAlign: 'center' }}>This is a Header</H1>
                                </>
                            </Header>
                        </Div>
                    </Div>
                    <Spacer style={{ height: "20px" }} />

                    <Div onClick={(e) => onSelect(e, 'hr')}>
                        <em style={{ color: `${elementType == 'hr' ? '#d67822' : 'initial'}` }}>hr</em>
                        <Div style={{ padding: 8, border: `${elementType == 'hr' ? '2px solid #d67822' : 'none'}` }}>

                            <Hr className={elementType == 'hr' && className} />
                        </Div>
                    </Div>
                    <Div style={{ display: 'flex' }}>
                        <Div style={{ width: 200 }} onClick={(e) => onSelect(e, 'aside')}>
                            <em style={{ color: `${elementType == 'aside' ? '#d67822' : 'initial'}` }}>Aside</em>
                            <Div style={{ padding: 8, border: `${elementType == 'aside' ? '2px solid #d67822' : 'none'}` }}>

                                <Aside className={elementType == 'aside' && className}>

                                    <Div>

                                        <Label>Search: <Input type="search" /></Label>
                                    </Div>
                                    <Spacer style={{ height: "20px" }} />

                                    <Div>

                                        <List style={{ padding: 10, listStyle: 'none', gap: 10 }}>

                                            <Li>
                                                <A href="#">Home</A>
                                            </Li>
                                            <Li>
                                                <A href="#">About</A>
                                            </Li>
                                            <Li>
                                                <A href="#">Contact</A>
                                            </Li>

                                        </List>

                                    </Div>

                                    <Spacer style={{ height: "20px" }} />

                                    <Div>

                                        <Img style={{ width: '100%', height: 'auto', objectFit: 'cover' }} src="https://picsum.photos/id/8/600/400" />
                                    </Div>

                                </Aside>
                            </Div>
                        </Div>

                        <Div onClick={(e) => onSelect(e, 'main')} style={{ flex: 1 }}>
                            <em style={{ color: `${elementType == 'main' ? '#d67822' : 'initial'}` }}>Main</em>
                            <Div style={{ padding: 8, border: `${elementType == 'main' ? '2px solid #d67822' : 'none'}` }}>

                                <Main className={elementType == 'main' && className}>
                                    <Div onClick={(e) => onSelect(e, 'article')}>
                                        <em style={{ color: `${elementType == 'article' ? '#d67822' : 'initial'}` }}>Artical</em>
                                        <Div style={{ border: `${elementType == 'article' ? '2px solid #d67822' : 'none'}` }}>

                                            <Article className={elementType == 'article' && className}>
                                                <Spacer style={{ height: "20px" }} />


                                                <Div onClick={(e) => onSelect(e, 'h1')}>
                                                    <em style={{ color: `${elementType == 'h1' ? '#d67822' : 'initial'}` }}>Heading 1</em>
                                                    <Div style={{ padding: 8, border: `${elementType == 'h1' ? '2px solid #d67822' : 'none'}` }}>

                                                        <H1 className={elementType == 'h1' && className} >This is a top-level heading</H1>
                                                    </Div></Div>                                            <Div onClick={(e) => onSelect(e, 'h2')}>

                                                    <em style={{ color: `${elementType == 'h2' ? '#d67822' : 'initial'}` }}>Heading 2</em>
                                                    <Div style={{ padding: 8, border: `${elementType == 'h2' ? '2px solid #d67822' : 'none'}` }}>

                                                        <H2 className={elementType == 'h2' && className}>This is a second-level heading</H2>  </Div></Div>
                                                <Div onClick={(e) => onSelect(e, 'h3')}>
                                                    <em style={{ color: `${elementType == 'h3' ? '#d67822' : 'initial'}` }}>Heading 3</em>

                                                    <Div style={{ padding: 8, border: `${elementType == 'h3' ? '2px solid #d67822' : 'none'}` }}>

                                                        <H3 className={elementType == 'h3' && className}>This is a third-level heading</H3>  </Div></Div>
                                                <Div onClick={(e) => onSelect(e, 'h4')}>
                                                    <em style={{ color: `${elementType == 'h4' ? '#d67822' : 'initial'}` }}>Heading 4</em>
                                                    <Div style={{ padding: 8, border: `${elementType == 'h4' ? '2px solid #d67822' : 'none'}` }}>

                                                        <H4 className={elementType == 'h4' && className}>This is a fourth-level heading</H4>  </Div></Div>
                                                <Div onClick={(e) => onSelect(e, 'h5')}>
                                                    <em style={{ color: `${elementType == 'h5' ? '#d67822' : 'initial'}` }}>Heading 5</em>
                                                    <Div style={{ padding: 8, border: `${elementType == 'h5' ? '2px solid #d67822' : 'none'}` }}>

                                                        <H5 className={elementType == 'h5' && className}>This is a fifth-level heading</H5>  </Div></Div>
                                                <Div onClick={(e) => onSelect(e, 'h6')}>
                                                    <em style={{ color: `${elementType == 'h6' ? '#d67822' : 'initial'}` }}>Heading 6</em>
                                                    <Div style={{ padding: 8, border: `${elementType == 'h6' ? '2px solid #d67822' : 'none'}` }}>

                                                        <H6 className={elementType == 'h6' && className}>This is a sixth-level heading</H6>  </Div></Div>
                                                <Div onClick={(e) => onSelect(e, 'p')}>
                                                    <em style={{ color: `${elementType == 'p' ? '#d67822' : 'initial'}` }}>Paragraph</em>
                                                    <Div style={{ padding: 8, border: `${elementType == 'p' ? '2px solid #d67822' : 'none'}` }}>

                                                        <P className={elementType == 'p' && className}>
                                                            This is a paragraph with some <i>italicized</i> and <strong>bolded</strong> text.

                                                            <Img src="https://picsum.photos/id/4/150/150" style={{ float: 'right', marginLeft: '10px' }} />
                                                            <br />    <br />
                                                            It also includes an image on the right side of the paragraph.
                                                            <br />
                                                            <br />

                                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pulvinar felis vitae mauris pellentesque, vel scelerisque justo iaculis. Nam bibendum, est vel tincidunt facilisis, sem lacus commodo eros, eu rutrum augue velit eu nisl. Vivamus ut lacus euismod,
                                                            <br />

                                                            <br />
                                                            <Span style={{ fontWeight: 100 }}>This text has a font weight of 100 </Span> <br />
                                                            <Span style={{ fontWeight: 200 }}>This text has a font weight of 200 </Span> <br />
                                                            <Span style={{ fontWeight: 300 }}>This text has a font weight of 300 </Span> <br />
                                                            <Span style={{ fontWeight: 400 }}>This text has a font weight of 400 </Span> <br />
                                                            <Span style={{ fontWeight: 500 }}>This text has a font weight of 500 </Span> <br />
                                                            <Span style={{ fontWeight: 600 }}>This text has a font weight of 600 </Span> <br />
                                                            <Span style={{ fontWeight: 700 }}>This text has a font weight of 700 </Span> <br />
                                                            <Span style={{ fontWeight: 800 }}>This text has a font weight of 800 </Span> <br />
                                                            <Span style={{ fontWeight: 900 }}>This text has a font weight of 900 </Span> <br />
                                                        </P>
                                                    </Div></Div>  <Div onClick={(e) => onSelect(e, 'ul')}>
                                                    <em style={{ color: `${elementType == 'ul' ? '#d67822' : 'initial'}` }}>List</em>
                                                    <Div style={{ padding: 8, border: `${elementType == 'ul' ? '2px solid #d67822' : 'none'}` }}>

                                                        <List className={elementType == 'ul' && className}>
                                                            <Div onClick={(e) => onSelect(e, 'li')} style={{ padding: 8, border: `${elementType == 'li' ? '2px solid #d67822' : 'none'}` }}>

                                                                <li className={elementType == 'li' && className}>This is an item in an unordered list (List).</li>
                                                            </Div>
                                                            <Div onClick={(e) => onSelect(e, 'li')} style={{ padding: 8, border: `${elementType == 'li' ? '2px solid #d67822' : 'none'}` }}>

                                                                <li className={elementType == 'li' && className}>It can contain another nested unordered list (List).
                                                                    <List >
                                                                        <li>This is a nested item in an unordered list (List).</li>
                                                                        <li>It can also contain another nested unordered list (List).</li>
                                                                    </List>
                                                                </li>
                                                            </Div>
                                                            <Div onClick={(e) => onSelect(e, 'li')} style={{ padding: 8, border: `${elementType == 'li' ? '2px solid #d67822' : 'none'}` }}>

                                                                <li className={elementType == 'li' && className}>It can also contain regular text.</li>
                                                            </Div>
                                                        </List>
                                                    </Div></Div>  <Div onClick={(e) => onSelect(e, 'ol')}>
                                                    <em onClick={(e) => onSelect(e, 'ol')} style={{ color: `${elementType == 'ol' ? '#d67822' : 'initial'}` }}>Order List</em>
                                                    <Div style={{ padding: 8, border: `${elementType == 'ol' ? '2px solid #d67822' : 'none'}` }}>

                                                        <OrderList className={elementType == 'ol' && className}>
                                                            <Div onClick={(e) => onSelect(e, 'li')} style={{ padding: 8, border: `${elementType == 'li' ? '2px solid #d67822' : 'none'}` }}>

                                                                <li className={elementType == 'li' && className}>This is an item in an ordered list (OrderList).</li>
                                                            </Div>
                                                            <Div onClick={(e) => onSelect(e, 'li')} style={{ padding: 8, border: `${elementType == 'li' ? '2px solid #d67822' : 'none'}` }}>

                                                                <li className={elementType == 'li' && className}>It can contain another nested ordered list (OrderList).
                                                                    <OrderList>
                                                                        <li>This is a nested item in an ordered list (OrderList).</li>
                                                                        <li>It can also contain another nested ordered list (OrderList).</li>
                                                                    </OrderList>
                                                                </li>
                                                            </Div>
                                                            <Div onClick={(e) => onSelect(e, 'li')} style={{ padding: 8, border: `${elementType == 'li' ? '2px solid #d67822' : 'none'}` }}>

                                                                <li className={elementType == 'li' && className}>It can also contain regular text.</li>
                                                            </Div>
                                                        </OrderList>
                                                    </Div></Div>  <Div onClick={(e) => onSelect(e, 'a')}>
                                                    <em style={{ color: `${elementType == 'a' ? '#d67822' : 'initial'}` }}>Link</em>
                                                    <Div style={{ padding: 8, border: `${elementType == 'a' ? '2px solid #d67822' : 'none'}` }}>

                                                        <A className={elementType == 'a' && className}>This is a link (A)</A>
                                                    </Div></Div>  <Div onClick={(e) => onSelect(e, 'blockquote')}>
                                                    <em style={{ color: `${elementType == 'blockquote' ? '#d67822' : 'initial'}` }}>Blockquote</em>
                                                    <Div style={{ padding: 8, border: `${elementType == 'blockquote' ? '2px solid #d67822' : 'none'}` }}>

                                                        <Blockquote className={elementType == 'blockquote' && className}>
                                                            <P>
                                                                "This is a blockquote with some quoted text."
                                                            </P>
                                                            <cite>- John Doe</cite>
                                                        </Blockquote>
                                                    </Div></Div>  <Div onClick={(e) => onSelect(e, '.text-division')}>
                                                    <em style={{ color: `${elementType == '.text-division' ? '#d67822' : 'initial'}` }}>Text</em>
                                                    <Div style={{ padding: 8, border: `${elementType == '.text-division' ? '2px solid #d67822' : 'none'}` }}>

                                                        <Span className={elementType == '.text-division' && className}>This is an span text. </Span>
                                                    </Div></Div>
                                                <Spacer style={{ height: "20px" }} />
                                                <Div onClick={(e) => onSelect(e, 'button')}>
                                                    <em style={{ color: `${elementType == 'button' ? '#d67822' : 'initial'}` }}>Button</em>
                                                    <Div style={{ padding: 8, border: `${elementType == 'button' ? '2px solid #d67822' : 'none'}` }}>

                                                        <Button className={elementType == 'button' && className}>This is a button</Button>
                                                    </Div></Div>
                                                <Spacer style={{ height: "20px" }} />


                                                <Div onClick={(e) => onSelect(e, 'img')}>
                                                    <em style={{ color: `${elementType == 'img' ? '#d67822' : 'initial'}` }}>Image</em>
                                                    <Div style={{ padding: 8, border: `${elementType == 'img' ? '2px solid #d67822' : 'none'}` }}>

                                                        <Img className={elementType == 'img' && className} src="https://picsum.photos/id/8/600/400" />
                                                    </Div></Div>
                                                <Spacer style={{ height: "20px" }} />
                                                <Div onClick={(e) => onSelect(e, 'video')}>
                                                    <em style={{ color: `${elementType == 'video' ? '#d67822' : 'initial'}` }}>Video</em>
                                                    <Div style={{ padding: 8, border: `${elementType == 'video' ? '2px solid #d67822' : 'none'}` }}>

                                                        <Video className={elementType == 'video' && className} controls={true} src="https://www.w3schools.com/html/mov_bbb.mp4" />

                                                    </Div></Div>
                                                <Spacer style={{ height: "20px" }} />
                                                <Div onClick={(e) => onSelect(e, 'audio')}>
                                                    <em style={{ color: `${elementType == 'audio' ? '#d67822' : 'initial'}` }}>Audio</em>
                                                    <Div style={{ padding: 8, border: `${elementType == 'audio' ? '2px solid #d67822' : 'none'}` }}>

                                                        <Audio className={elementType == 'audio' && className} controls={true} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
                                                    </Div></Div>

                                                <Spacer style={{ height: "20px" }} />
                                                <Div onClick={(e) => onSelect(e, 'table')}>
                                                    <em style={{ color: `${elementType == 'table' ? '#d67822' : 'initial'}` }}>Table</em>
                                                    <Div style={{ padding: 8, border: `${elementType == 'table' ? '2px solid #d67822' : 'none'}` }}>
                                                        {/* 
                                                        <Table className={elementType == 'table' && className}>
                                                            <Div onClick={(e) => onSelect(e, 'thead')}>

                                                                <Div onClick={(e) => onSelect(e, 'thead')} style={{ padding: 8, border: `${elementType == 'thead' ? '2px solid #d67822' : 'none'}` }}>

                                                                    <Thead className={elementType == 'thead' && className}>
                                                                        <Div onClick={(e) => onSelect(e, 'tr')}>
                                                                            <Div onClick={(e) => onSelect(e, 'tr')} style={{ padding: 8, border: `${elementType == 'tr' ? '2px solid #d67822' : 'none'}` }}>

                                                                                <Tr className={elementType == 'tr' && className}>
                                                                                    <Th>
                                                                                        <Div onClick={(e) => onSelect(e, 'th')} style={{ padding: 8, border: `${elementType == 'th' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Th className={elementType == 'th' && className}>Header 1</Th>
                                                                                        </Div>
                                                                                    </Th>
                                                                                    <Th>
                                                                                        <Div onClick={(e) => onSelect(e, 'th')} style={{ padding: 8, border: `${elementType == 'th' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Th className={elementType == 'th' && className}>Header 2</Th>

                                                                                        </Div>
                                                                                    </Th>
                                                                                    <Th>
                                                                                        <Div onClick={(e) => onSelect(e, 'th')} style={{ padding: 8, border: `${elementType == 'th' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Th className={elementType == 'th' && className}>Header 3</Th>     </Div>   </Th>   <Th>
                                                                                        <Div onClick={(e) => onSelect(e, 'th')} style={{ padding: 8, border: `${elementType == 'th' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Th className={elementType == 'th' && className}>Header 4</Th>    </Div>    </Th>    <Th>
                                                                                        <Div onClick={(e) => onSelect(e, 'th')} style={{ padding: 8, border: `${elementType == 'th' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Th className={elementType == 'th' && className}>Header 5</Th>    </Div>  </Th>   <Th>
                                                                                        <Div onClick={(e) => onSelect(e, 'th')} style={{ padding: 8, border: `${elementType == 'th' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Th className={elementType == 'th' && className}>Header 6</Th>    </Div>    </Th>    <Th>
                                                                                        <Div onClick={(e) => onSelect(e, 'th')} style={{ padding: 8, border: `${elementType == 'th' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Th className={elementType == 'th' && className}>Header 7</Th>    </Div> </Th>      <Th>
                                                                                        <Div onClick={(e) => onSelect(e, 'th')} style={{ padding: 8, border: `${elementType == 'th' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Th className={elementType == 'th' && className}>Header 8</Th>  </Div>   </Th>      <Th>
                                                                                        <Div onClick={(e) => onSelect(e, 'th')} style={{ padding: 8, border: `${elementType == 'th' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Th className={elementType == 'th' && className}>Header 9</Th>    </Div>   </Th>    <Th>
                                                                                        <Div onClick={(e) => onSelect(e, 'th')} style={{ padding: 8, border: `${elementType == 'th' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Th className={elementType == 'th' && className}>Header 10</Th></Div> </Th>
                                                                                </Tr>
                                                                            </Div>
                                                                        </Div>
                                                                    </Thead>
                                                                </Div>
                                                            </Div>
                                                            <Div onClick={(e) => onSelect(e, 'tbody')}>
                                                                <em style={{ color: `${elementType == 'tbody' ? '#d67822' : 'initial'}` }}>Body</em>
                                                                <Div style={{ padding: 8, border: `${elementType == 'tbody' ? '2px solid #d67822' : 'none'}` }}>

                                                                    <Tbody className={elementType == 'tbody' && className}>
                                                                        <Div onClick={(e) => onSelect(e, 'tr')}>
                                                                            <em style={{ color: `${elementType == 'tr' ? '#d67822' : 'initial'}` }}>Row</em>
                                                                            <Div onClick={(e) => onSelect(e, 'tr')} style={{ padding: 8, border: `${elementType == 'tr' ? '2px solid #d67822' : 'none'}` }}>

                                                                                <Tr className={elementType == 'tr' && className}>
                                                                                    <Td>
                                                                                        <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Td className={elementType == 'td' && className}>Cell 1</Td>
                                                                                        </Div>
                                                                                    </Td>
                                                                                    <Td>
                                                                                        <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Td className={elementType == 'td' && className}>Cell 2</Td></Div>
                                                                                    </Td>

                                                                                    <Td>
                                                                                        <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Td className={elementType == 'td' && className}>Cell 3</Td>     </Div>
                                                                                    </Td>
                                                                                    <Td>                                                              <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Cell 4</Td>     </Div>
                                                                                    </Td>
                                                                                    <Td>                                                                 <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Cell 5</Td>     </Div>
                                                                                    </Td>
                                                                                    <Td>                                                               <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Cell 6</Td>     </Div>
                                                                                    </Td>
                                                                                    <Td>                                                              <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Cell 7</Td>    </Div>
                                                                                    </Td>
                                                                                    <Td>                                                                <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Cell 8</Td>    </Div>
                                                                                    </Td>
                                                                                    <Td>                                                              <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Cell 9</Td>  </Div>
                                                                                    </Td>
                                                                                    <Td>                                                             <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Cell 10</Td>
                                                                                    </Div>
                                                                                    </Td>
                                                                                </Tr>
                                                                            </Div>
                                                                        </Div>
                                                                        <Div onClick={(e) => onSelect(e, 'tr')}>
                                                                            <em style={{ color: `${elementType == 'tr' ? '#d67822' : 'initial'}` }}>Row</em>
                                                                            <Div onClick={(e) => onSelect(e, 'tr')} style={{ padding: 8, border: `${elementType == 'tr' ? '2px solid #d67822' : 'none'}` }}>

                                                                                <Tr className={elementType == 'tr' && className}>
                                                                                    <Td>
                                                                                        <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Td className={elementType == 'td' && className}>Cell 1</Td>
                                                                                        </Div>
                                                                                    </Td>
                                                                                    <Td>
                                                                                        <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Td className={elementType == 'td' && className}>Cell 2</Td></Div>
                                                                                    </Td>

                                                                                    <Td>
                                                                                        <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Td className={elementType == 'td' && className}>Cell 3</Td>     </Div>
                                                                                    </Td>
                                                                                    <Td>                                                              <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Cell 4</Td>     </Div>
                                                                                    </Td>
                                                                                    <Td>                                                                 <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Cell 5</Td>     </Div>
                                                                                    </Td>
                                                                                    <Td>                                                               <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Cell 6</Td>     </Div>
                                                                                    </Td>
                                                                                    <Td>                                                              <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Cell 7</Td>    </Div>
                                                                                    </Td>
                                                                                    <Td>                                                                <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Cell 8</Td>    </Div>
                                                                                    </Td>
                                                                                    <Td>                                                              <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Cell 9</Td>  </Div>
                                                                                    </Td>
                                                                                    <Td>                                                             <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Cell 10</Td>
                                                                                    </Div>
                                                                                    </Td>
                                                                                </Tr>
                                                                            </Div>
                                                                        </Div>



                                                                    </Tbody>
                                                                </Div>
                                                            </Div>
                                                            <Div onClick={(e) => onSelect(e, 'tfoot')}>
                                                                <em style={{ color: `${elementType == 'tfoot' ? '#d67822' : 'initial'}` }}>Foot</em>
                                                                <Div style={{ padding: 8, border: `${elementType == 'tfoot' ? '2px solid #d67822' : 'none'}` }}>

                                                                    <Tfoot className={elementType == 'tfoot' && className}>
                                                                        <Div onClick={(e) => onSelect(e, 'tr')}>
                                                                            <em style={{ color: `${elementType == 'tr' ? '#d67822' : 'initial'}` }}>Row</em>
                                                                            <Div style={{ padding: 8, border: `${elementType == 'tr' ? '2px solid #d67822' : 'none'}` }}>

                                                                                <Tr className={elementType == 'tr' && className}>
                                                                                    <Td>
                                                                                        <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Td className={elementType == 'td' && className}>Footer 1</Td>
                                                                                        </Div></Td> <Td>
                                                                                        <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Td className={elementType == 'td' && className}>Footer 2</Td></Div> </Td><Td>
                                                                                        <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                            <Td className={elementType == 'td' && className}>Footer 3</Td>    </Div>
                                                                                    </Td>
                                                                                    <Td>                                                             <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Footer 4</Td>    </Div>
                                                                                    </Td>
                                                                                    <Td>                                                            <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}> Footer 5</Td>    </Div>
                                                                                    </Td>
                                                                                    <Td>                                                           <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Footer 6</Td>    </Div>
                                                                                    </Td>
                                                                                    <Td>                                                           <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Footer 7</Td>   </Div>
                                                                                    </Td>
                                                                                    <Td>                                                            <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Footer 8</Td>  </Div>
                                                                                    </Td>
                                                                                    <Td>                                                          <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Footer 9</Td>     </Div>
                                                                                    </Td>
                                                                                    <Td>                                                         <Div onClick={(e) => onSelect(e, 'td')} style={{ padding: 8, border: `${elementType == 'td' ? '2px solid #d67822' : 'none'}` }}>

                                                                                        <Td className={elementType == 'td' && className}>Footer 10</Td> </Div>
                                                                                    </Td>
                                                                                </Tr>
                                                                            </Div>
                                                                        </Div>
                                                                    </Tfoot>
                                                                </Div>
                                                            </Div>
                                                        </Table> */}
                                                        <Table className={elementType == 'table' && className}>
                                                            <thead>
                                                                <tr>
                                                                    <th>Header 1</th>
                                                                    <th>Header 2</th>
                                                                    <th>Header 3</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>Data 1</td>
                                                                    <td>Data 2</td>
                                                                    <td>Data 3</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Data 4</td>
                                                                    <td>Data 5</td>
                                                                    <td>Data 6</td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>

                                                    </Div>
                                                </Div>

                                            </Article>
                                        </Div>
                                    </Div>


                                </Main>
                            </Div>
                        </Div>

                        <Div style={{ width: 200 }} onClick={(e) => onSelect(e, 'aside')}>
                            <em style={{ color: `${elementType == 'aside' ? '#d67822' : 'initial'}` }}>Aside</em>
                            <Div style={{ padding: 8, border: `${elementType == 'aside' ? '2px solid #d67822' : 'none'}` }}>

                                <Aside className={elementType == 'aside' && className}>

                                    <Div>

                                        <Label>Search: <Input type="search" /></Label>
                                    </Div>
                                    <Spacer style={{ height: "20px" }} />

                                    <Div>

                                        <List style={{ padding: 10, listStyle: 'none', gap: 10 }}>

                                            <Li>
                                                <A href="#">Home</A>
                                            </Li>
                                            <Li>
                                                <A href="#">About</A>
                                            </Li>
                                            <Li>
                                                <A href="#">Contact</A>
                                            </Li>

                                        </List>

                                    </Div>

                                    <Spacer style={{ height: "20px" }} />

                                    <Div>

                                        <Img style={{ width: '100%', height: 'auto', objectFit: 'cover' }} src="https://picsum.photos/id/8/600/400" />
                                    </Div>

                                </Aside>
                            </Div>
                        </Div>

                    </Div>

                    <Spacer style={{ height: "20px" }} />


                    <Div onClick={(e) => onSelect(e, 'section')} style={{ padding: 8 }}>
                        <em style={{ color: `${elementType == 'section' ? '#d67822' : 'initial'}` }}>Section</em>

                        <Div style={{ padding: 8, border: `${elementType == 'section' ? '2px solid #d67822' : 'none'}` }}>

                            <Section className={elementType == 'section' && className}>

                                <Div onClick={(e) => onSelect(e, '.box-division')} style={{ padding: 8 }}>
                                    <em style={{ color: `${elementType == '.box-division' ? '#d67822' : 'initial'}` }}>Div</em>

                                    <Div style={{ padding: 8, border: `${elementType == '.box-division' ? '2px solid #d67822' : 'none'}` }}>

                                        <Div className={elementType == '.box-division' && className}>
                                            <Div style={{ background: '#f9f9f9', padding: 10 }}>Child</Div>
                                        </Div>

                                    </Div>
                                </Div>

                            </Section>

                        </Div>
                    </Div>


                    <Spacer style={{ height: "20px" }} />

                    <Div onClick={(e) => onSelect(e, 'form')} style={{ padding: 8 }}>
                        <em style={{ color: `${elementType == 'form' ? '#d67822' : 'initial'}` }}>Form</em>
                        <Div style={{ padding: 8, border: `${elementType == 'form' ? '2px solid #d67822' : 'none'}` }}>

                            <Form className={elementType == 'form' && className}>
                                <Div onClick={(e) => onSelect(e, 'label')}>
                                    <em style={{ color: `${elementType == 'label' ? '#d67822' : 'initial'}` }}>Label</em>
                                    <Div style={{ padding: 8, border: `${elementType == 'label' ? '2px solid #d67822' : 'none'}` }}>

                                        <Label className={elementType == 'label' && className}>This is a Label</Label>
                                    </Div></Div>
                                <Spacer style={{ height: "20px" }} />
                                <Div onClick={(e) => onSelect(e, 'input')}>
                                    <em style={{ color: `${elementType == 'input' ? '#d67822' : 'initial'}` }}>Input</em>
                                    <Div style={{ padding: 8, border: `${elementType == 'input' ? '2px solid #d67822' : 'none'}` }}>

                                        <Label>Label: <Input className={elementType == 'input' && className} type="text" /></Label>
                                    </Div></Div>
                                <Spacer style={{ height: "20px" }} />  <Div onClick={(e) => onSelect(e, 'input[type="file"]')}>
                                    <em style={{ color: `${elementType == 'input[type="file"]' ? '#d67822' : 'initial'}` }}>File Input</em>
                                    <Div style={{ padding: 8, border: `${elementType == 'input[type="file"]' ? '2px solid #d67822' : 'none'}` }}>

                                        <Label>Label: <Input className={elementType == 'input[type="file"]' && className} type="file" /></Label>
                                    </Div></Div>
                                <Spacer style={{ height: "20px" }} />  <Div onClick={(e) => onSelect(e, 'input[type="checkbox"]')}>
                                    <em style={{ color: `${elementType == 'input[type="checkbox"]' ? '#d67822' : 'initial'}` }}>Checkbox</em>
                                    <Div style={{ padding: 8, border: `${elementType == 'input[type="checkbox"]' ? '2px solid #d67822' : 'none'}` }}>

                                        <Label>Label: <Input className={elementType == 'input[type="checkbox"]' && className} type="checkbox" /></Label>
                                    </Div></Div>
                                <Spacer style={{ height: "20px" }} />  <Div onClick={(e) => onSelect(e, 'input[type="radio"]')}>
                                    <em style={{ color: `${elementType == 'input[type="radio"]' ? '#d67822' : 'initial'}` }}>Radio</em>
                                    <Div style={{ padding: 8, border: `${elementType == 'input[type="radio"]' ? '2px solid #d67822' : 'none'}` }}>

                                        <Label>Label:  <Input className={elementType == 'input[type="radio"]' && className} type="radio" /></Label>
                                    </Div></Div>

                                <Spacer style={{ height: "20px" }} />  <Div onClick={(e) => onSelect(e, 'input[type="range"]')}>
                                    <em style={{ color: `${elementType == 'input[type="range"]' ? '#d67822' : 'initial'}` }}>Range</em>
                                    <Div style={{ padding: 8, border: `${elementType == 'input[type="range"]' ? '2px solid #d67822' : 'none'}` }}>

                                        <Label>Label:   <Input className={elementType == 'input[type="range"]' && className} type="range" /></Label>
                                    </Div></Div>
                                <Spacer style={{ height: "20px" }} />
                                <Div onClick={(e) => onSelect(e, 'input[type="color"]')}>

                                    <em style={{ color: `${elementType == 'input[type="color"]' ? '#d67822' : 'initial'}` }}>Color</em>
                                    <Div style={{ padding: 8, border: `${elementType == 'input[type="color"]' ? '2px solid #d67822' : 'none'}` }}>

                                        <Label>Label: <Input className={elementType == 'input[type="color"]' && className} type="color" /></Label>
                                    </Div></Div>
                                <Spacer style={{ height: "20px" }} />  <Div onClick={(e) => onSelect(e, 'select')}>
                                    <em style={{ color: `${elementType == 'select' ? '#d67822' : 'initial'}` }}>Select</em>
                                    <Div style={{ padding: 8, border: `${elementType == 'select' ? '2px solid #d67822' : 'none'}` }}>

                                        <Select className={elementType == 'select' && className}><option>Select Option</option> <option>Option 1</option> <option>Option 2</option></Select>
                                    </Div></Div>
                                <Spacer style={{ height: "20px" }} />
                                <Div onClick={(e) => onSelect(e, 'select[multiple=true]')}>
                                    <em style={{ color: `${elementType == 'select[multiple=true]' ? '#d67822' : 'initial'}` }}>Mutiple Select</em>
                                    <Div style={{ padding: 8, border: `${elementType == 'select[multiple=true]' ? '2px solid #d67822' : 'none'}` }}>

                                        <Label><Select className={elementType == 'select[multiple=true]' && className} multiple={true}><option>Select Option</option> <option>Option 1</option> <option>Option 2</option></Select></Label>
                                    </Div></Div>

                                <Spacer style={{ height: "20px" }} />
                                <Div onClick={(e) => onSelect(e, 'textarea')}>
                                    <em style={{ color: `${elementType == 'textarea' ? '#d67822' : 'initial'}` }}>Textarea</em>
                                    <Div style={{ padding: 8, border: `${elementType == 'textarea' ? '2px solid #d67822' : 'none'}` }}>

                                        <Label>Label: <Textarea className={elementType == 'textarea' && className}></Textarea></Label>
                                    </Div></Div>
                                <Spacer style={{ height: "20px" }} />  <Div onClick={(e) => onSelect(e, 'input[type="submit"]')}>
                                    <em style={{ color: `${elementType == 'input[type="submit"]' ? '#d67822' : 'initial'}` }}>Submit Button</em>
                                    <Div style={{ padding: 8, border: `${elementType == 'input[type="submit"]' ? '2px solid #d67822' : 'none'}` }}>

                                        <Button className={elementType == 'input[type="submit"]' && className}>Submit</Button>
                                    </Div></Div>
                            </Form>
                        </Div>
                    </Div>
                    <Spacer style={{ height: "20px" }} />
                    <Div onClick={(e) => onSelect(e, 'hr')}>
                        <em style={{ color: `${elementType == 'hr' ? '#d67822' : 'initial'}` }}>hr</em>
                        <Div style={{ padding: 8, border: `${elementType == 'hr' ? '2px solid #d67822' : 'none'}` }}>

                            <Hr className={elementType == 'hr' && className} />
                        </Div>
                    </Div>
                    <Div onClick={(e) => onSelect(e, 'footer')}>
                        <em style={{ color: `${elementType == 'footer' ? '#d67822' : 'initial'}` }}>Footer</em>
                        <Div style={{ padding: 8, border: `${elementType == 'footer' ? '2px solid #d67822' : 'none'}` }}>

                            <Footer className={elementType == 'footer' && className}>
                                <Span>&copy; {new Date().getFullYear()} example.com. All rights reserved.</Span>
                            </Footer>
                        </Div>
                    </Div>

                </Body>
            </Div>
        </Div>
    </>

}


export const Element = ({ classNames, elementType, className, onSelect }) => {

    const onSelectSelector = (e, selectorText) => {
        e.preventDefault();
        onSelect(elementType, selectorText)
    }

    const classArray = Array.from(classNames);
    if (classArray.length <= 0 && elementType !== "default")
        return <p style={{padding: 10}}>no selector found.</p>

    switch (elementType) {
        case 'root':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>body.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Body className={cls}>
                            <h1>This is a heading</h1>
                            <p>This is a paragraph.</p>
                        </Body>
                    </Div>
                </Div>)
            }
            </div>
        case 'nav':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>nav.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Nav className={cls}>
                            <Div style={{ display: 'flex', justifyContent: 'space-between' }} >
                                <Div style={{ padding: 8 }}>
                                    <Img src="https://picsum.photos/id/2/80/50" />
                                </Div>


                                <Div style={{  }}>

                                    <List style={{ display: 'flex', listStyle: 'none', gap: 10 }}>

                                        <Li>
                                            <A href="#">Home</A>
                                        </Li>
                                        <Li>
                                            <A href="#">About</A>
                                        </Li>
                                        <Li>
                                            <A href="#">Contact</A>
                                        </Li>

                                    </List>

                                </Div>
                            </Div>
                        </Nav>
                    </Div>
                </Div>)
            }
            </div>
        case 'header':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>header.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Header className={cls}>

                            <Div style={{ padding: 10 }}>

                                <Nav>
                                    <Div style={{ display: 'flex', justifyContent: 'space-between' }} >
                                        <Div style={{ padding: 8 }}>
                                            <Img src="https://picsum.photos/id/2/80/50" />
                                        </Div>


                                        <Div style={{  }}>

                                            <List style={{ display: 'flex', listStyle: 'none', gap: 10 }}>

                                                <Li>
                                                    <A href="#">Home</A>
                                                </Li>
                                                <Li>
                                                    <A href="#">About</A>
                                                </Li>
                                                <Li>
                                                    <A href="#">Contact</A>
                                                </Li>

                                            </List>

                                        </Div>
                                    </Div>
                                </Nav>

                                <H2 style={{ textAlign: 'center' }}>This is a Header</H2>
                            </Div>
                        </Header>
                    </Div>
                </Div>)
            }
            </div>
        case 'aside':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>aside.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Aside className={cls}>

                            <Div>
                                <Label>Search: <Input type="search" /></Label>
                            </Div>
                            <Spacer style={{ height: "20px" }} />

                            <Div style={{  }}>

                                <List style={{ padding: 10, listStyle: 'none', gap: 10 }}>

                                    <Li>
                                        <A href="#">Home</A>
                                    </Li>
                                    <Li>
                                        <A href="#">About</A>
                                    </Li>
                                    <Li>
                                        <A href="#">Contact</A>
                                    </Li>

                                </List>

                            </Div>

                            <Spacer style={{ height: "20px" }} />

                            <Div>

                                <Img style={{ width: '100%', height: 'auto', objectFit: 'cover' }} src="https://picsum.photos/id/8/600/400" />
                            </Div>

                        </Aside>
                    </Div>
                </Div>)
            }
            </div>
        case 'main':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>main.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Main className={cls}>
                            <>
                                <h1>Lorem ipsum dolor</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum odio id lacinia ultrices. Vestibulum hendrerit fringilla sem, nec consequat neque aliquet a. Sed aliquam finibus risus, sit amet gravida felis venenatis ut.</p>

                                <h2>Lorem ipsum dolor</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum odio id lacinia ultrices. Vestibulum hendrerit fringilla sem, nec consequat neque aliquet a. Sed aliquam finibus risus, sit amet gravida felis venenatis ut.</p>

                            </>
                        </Main>
                    </Div>
                </Div>)}
            </div>
        case 'hr':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>main.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Hr className={cls} />

                    </Div>
                </Div>)
            }
            </div>
        case 'article':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>article.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Article className={cls}>
                            <h2>Introduction</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum odio id lacinia ultrices. Vestibulum hendrerit fringilla sem, nec consequat neque aliquet a. Sed aliquam finibus risus, sit amet gravida felis venenatis ut.</p>

                            <h2>Main Content</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum odio id lacinia ultrices. Vestibulum hendrerit fringilla sem, nec consequat neque aliquet a. Sed aliquam finibus risus, sit amet gravida felis venenatis ut.</p>
                            <p>Sed facilisis lectus a nulla commodo luctus. Maecenas bibendum vel mauris eget tempor. Aliquam ac dui id tellus gravida hendrerit. Nulla facilisi. Aenean congue elementum eros, et semper ex dapibus non.</p>

                            <h2>Conclusion</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum odio id lacinia ultrices. Vestibulum hendrerit fringilla sem, nec consequat neque aliquet a. Sed aliquam finibus risus, sit amet gravida felis venenatis ut.</p>

                            <h2>References</h2>
                            <ul>
                                <li>Reference 1</li>
                                <li>Reference 2</li>
                                <li>Reference 3</li>
                            </ul>
                        </Article>
                    </Div>
                </Div>)
            }
            </div>
        case 'section':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>section.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Section className={cls}>
                            <Div style={{ padding: 10 }}>
                                <h2>Lorem ipsum dolor</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla condimentum odio id lacinia ultrices. Vestibulum hendrerit fringilla sem, nec consequat neque aliquet a. Sed aliquam finibus risus, sit amet gravida felis venenatis ut.</p>
                            </Div>

                        </Section>
                    </Div>
                </Div >)
            }
            </div >
        case 'div':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>div.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Div className={cls}>

                        <Div style={{ background: '#f9f9f9', width: 100, height: 100, padding: 10 }}>Child 1</Div>
                        <Div style={{ background: '#f9f9f9', width: 100, height: 100, padding: 10 }}>Child 2</Div>
                        <Div style={{ background: '#f9f9f9', width: 100, height: 100, padding: 10 }}>Child 3</Div>

                        <Div style={{ background: '#f9f9f9', width: 100, height: 100, padding: 10 }}>Child 4</Div>

                        </Div>
                    </Div>
                </Div>)
            }
            </div>
        case 'footer':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>footer.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Footer className={cls}>
                            <p>&copy; {new Date().getFullYear()}  example.com. All rights reserved.</p>
                        </Footer>
                    </Div>
                </Div>)
            }
            </div>
        case 'h1':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>h1.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <H1 className={cls} >This is a top-level heading</H1>
                    </Div>
                </Div>)
            }
            </div>
        case 'h2':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>h2.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <H1 className={cls} >This is a second-level heading</H1>
                    </Div>
                </Div>)
            }
            </div>
        case 'h3':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>h3.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <H1 className={cls} >This is a third-level heading</H1>
                    </Div>
                </Div>)
            }
            </div>
        case 'h4':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>h4.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <H1 className={cls} >This is a fourth-level heading</H1>
                    </Div>
                </Div>)
            }
            </div>
        case 'h5':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>h5.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <H1 className={cls} >This is a fifth-level heading</H1>
                    </Div>
                </Div>)
            }
            </div>
        case 'h6':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>h6.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <H1 className={cls} >This is a sixth-level heading</H1>
                    </Div>
                </Div>)
            }
            </div>
        case 'p':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>p.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <P className={cls}>
                            This is a paragraph with some <i>italicized</i> and <strong>bolded</strong> text.

                            <Img src="https://picsum.photos/id/4/150/150" style={{ float: 'right', marginLeft: '10px' }} />
                            <br />    <br />
                            It also includes an image on the right side of the paragraph.
                            <br />
                            <br />

                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pulvinar felis vitae mauris pellentesque, vel scelerisque justo iaculis. Nam bibendum, est vel tincidunt facilisis, sem lacus commodo eros, eu rutrum augue velit eu nisl. Vivamus ut lacus euismod,
                            <br />

                            <br />
                            <Span style={{ fontWeight: 100 }}>This text has a font weight of 100 </Span> <br />
                            <Span style={{ fontWeight: 200 }}>This text has a font weight of 200 </Span> <br />
                            <Span style={{ fontWeight: 300 }}>This text has a font weight of 300 </Span> <br />
                            <Span style={{ fontWeight: 400 }}>This text has a font weight of 400 </Span> <br />
                            <Span style={{ fontWeight: 500 }}>This text has a font weight of 500 </Span> <br />
                            <Span style={{ fontWeight: 600 }}>This text has a font weight of 600 </Span> <br />
                            <Span style={{ fontWeight: 700 }}>This text has a font weight of 700 </Span> <br />
                            <Span style={{ fontWeight: 800 }}>This text has a font weight of 800 </Span> <br />
                            <Span style={{ fontWeight: 900 }}>This text has a font weight of 900 </Span> <br />
                        </P>                        </Div>
                </Div>)
            }
            </div>
        case 'ul':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>ul.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <List className={cls}>
                            <li>This is an item in an unordered list.</li>

                            <li>It can contain another nested unordered list).
                                <List >
                                    <li>This is a nested item in an unordered list.</li>
                                    <li>It can also contain another nested unordered list.</li>
                                </List>
                            </li>
                            <li>This is an item in an unordered list</li>
                        </List>
                    </Div>
                </Div>)
            }
            </div>
        case 'ol':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>ol.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <OrderList className={cls}>
                            <li>This is an item in an unordered list.</li>

                            <li>It can contain another nested unordered list).
                                <OrderList>
                                    <li>This is a nested item in an unordered list.</li>
                                    <li>It can also contain another nested unordered list.</li>
                                </OrderList>
                            </li>
                            <li>This is an item in an unordered list</li>
                        </OrderList>                    </Div>
                </Div>)
            }
            </div>
        case 'li':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>li.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <ul>
                            <li className={cls}>This is an item in an list item.</li>
                        </ul>
                    </Div>
                </Div>)
            }
            </div>

        case 'a':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>a.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <A className={cls}>This is a link.</A>

                    </Div>
                </Div>)
            }
            </div>
        case 'blockquote':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>blockquote.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>

                        <Blockquote className={cls}>
                            <P>
                                "This is a blockquote with some quoted text."
                            </P>
                            <cite>- John Doe</cite>
                        </Blockquote>
                    </Div>
                </Div>)
            }
            </div>
        case 'span':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>span.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>

                        <Span className={cls}>This is an span text. </Span>


                    </Div>
                </Div>)
            }
            </div>
        case 'button':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>button.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Button className={cls}>button</Button>

                    </Div>
                </Div>)
            }
            </div>
        case 'img':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>img.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Img className={cls} src="https://picsum.photos/id/8/600/400" />


                    </Div>
                </Div>)
            }
            </div>
        case 'video':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>img.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Video className={cls} controls={true} src="https://www.w3schools.com/html/mov_bbb.mp4" />

                    </Div>
                </Div>)
            }
            </div>
        case 'audio':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>img.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Audio className={cls} controls={true} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />


                    </Div>
                </Div>)
            }
            </div>
        case 'form':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>form.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Form className={cls}>

                            <Label>Input: <Input placeholder="Enter Input" type="text" /></Label>
                            <Spacer style={{ height: "20px" }} />
                            <Label>Message: <Textarea placeholder="Enter Message"></Textarea></Label>
                            <Spacer style={{ height: "20px" }} />

                            <Button>Submit</Button>

                        </Form>

                    </Div>
                </Div>)
            }
            </div>
        case 'label':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>label.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Label className={cls}>This is a Label</Label>


                    </Div>
                </Div>)
            }
            </div>
        case 'input':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>input.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>

                        <Input placeholder="Enter Input" className={cls} type="text" />


                    </Div>
                </Div>)
            }
            </div>
        case 'input[type="file"]':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>input[type="file"].{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Input className={cls} type="file" />
                    </Div>
                </Div>)
            }
            </div>
        case 'input[type="color"]':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>input[type="color"].{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Input className={cls} type="color" />

                    </Div>
                </Div>)
            }
            </div>
        case 'select':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>select.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Select className={cls}>
                            <option>Select Option</option> <option>Option 1</option> <option>Option 2</option>
                        </Select>


                    </Div>
                </Div>)
            }
            </div>

        case 'select[multiple=true]':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}>  select[multiple=true].{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Select className={cls} multiple={true}>
                            <option>Select Option</option> <option>Option 1</option> <option>Option 2</option>
                        </Select>

                    </Div>
                </Div>)
            }
            </div>
        case 'textarea':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}> textarea.{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Textarea className={cls} placeholder="Enter Value"></Textarea>

                    </Div>
                </Div>)
            }
            </div>
        case 'input[type="submit"]':
            return <div>{classArray.map(cls =>
                <Div onClick={(e) => onSelectSelector(e, '.' + cls)} style={{ cursor: 'pointer' }} >
                    <em style={{ color: `${cls == className ? '#d67822' : 'initial'}` }}> input[type="submit"].{`${cls}`}</em>
                    <Div style={{ padding: 8, border: `${cls == className ? '2px solid #d67822' : 'none'}` }}>
                        <Button className={cls} type="submit">Submit</Button>
                    </Div>
                </Div>)
            }
            </div>

        case 'default':
        default:
            return <Structure />
    }



}

export default ({ elementType, classNames = [], className, onSelect }) => {

    return <Element
        onSelect={onSelect}
        elementType={elementType}
        classNames={classNames}
        className={className} />

}