import React, { useEffect, useState } from 'react';
import Container from './Container';
import Menu from './Menu';

import Text from './Text';
import Icon from './Icon';

import Link from "./Link";
import List from './List';
import Header from './Header';
import Nav from './Nav';
import Aside from './Aside';
import Main from './Main';
import Section from './Section';
import Div from './Div';
import Article from './Article';
import Hr from './HR';
import Footer from './Footer';
import Image from './Image';
import Video from './Video';
import Audio from './Audio';
import Inputs from './Input';
import Buttons from './Button';
import Selects from './Select';
import FileInput from './FileInput';
import RadioCheckbox from './RadioCheckbox';
import Sliders from './Slider';
import Flex from './Flex';
import Grid from './Grid';
import Slides from './Slides';
import Slide from './Slide';
import Tabs from './Tabs';
import TabsContent from './TabsContent';
import TabContent from './TabContent';
import TabsButton from './TabsButton';
import Accordions from './Accordions';
import Accordion from './Accordion';
import Gallery from './Gallery';
import Modal from './Modal';
import Sider from './Sider';
import Dropdowns from './Dropdown';
import GoToTop from './GoToTop';
import SvgIcon from './SvgIcon';

import { Button, Card } from 'antd'

function LayoutStyle({ children, layout, selector, onChange, isStyleChange, onUpdate }) {




  const Component =
    layout === 'container' ? (
      <Container selector={selector} setChange={onChange}>{children}</Container>
    ) : layout === 'menu' ? (
      <Menu selector={selector} setChange={onChange} >{children}</Menu>
    ) : layout === 'slider' ? (
      <Sliders selector={selector} setChange={onChange}>{children}</Sliders>
    ) : layout === 'slides' ? (
      <Slides selector={selector} setChange={onChange}>{children}</Slides>
    ) : layout === 'slide' ? (
      <Slide selector={selector} setChange={onChange}>{children}</Slide>
    ) : layout === 'tabs' ? (
      <Tabs selector={selector} setChange={onChange}>{children}</Tabs>
    ) : layout === 'tabs-content' ? (
      <TabsContent selector={selector} setChange={onChange}>{children}</TabsContent>
    ) : layout === 'tab-content' ? (
      <TabContent selector={selector} setChange={onChange}>{children}</TabContent>
    ) : layout === 'tabs-btn' ? (
      <TabsButton selector={selector} setChange={onChange}>{children}</TabsButton>
    ) : layout === 'accordions' ? (
      <Accordions selector={selector} setChange={onChange}>{children}</Accordions>
    ) : layout === 'accordion' ? (
      <Accordion selector={selector} setChange={onChange}>{children}</Accordion>
    ) : layout === 'gallery' ? (
      <Gallery selector={selector} setChange={onChange}>{children}</Gallery>
    ) : layout === 'sider' ? (
      <Sider selector={selector} setChange={onChange}>{children}</Sider>
    ) : layout === 'modal' ? (
      <Modal selector={selector} setChange={onChange}>{children}</Modal>
    ) : layout === 'dropdown' ? (
      <Dropdowns selector={selector} setChange={onChange}>{children}</Dropdowns>
    ) : layout === 'gototop' ? (
      <GoToTop selector={selector} setChange={onChange}>{children}</GoToTop>
    ) : layout === 'flex' ? (
      <Flex selector={selector} setChange={onChange}>{children}</Flex>
    ) : layout === 'grid' ? (
      <Grid selector={selector} setChange={onChange}>{children}</Grid>
    ) : layout === 'text' ? (
      <Text selector={selector} setChange={onChange}>{children}</Text>
    ) : layout === 'icon' ? (
      <Icon selector={selector} setChange={onChange}>{children}</Icon>
    ) : layout === 'svg-icon' ? (
      <SvgIcon selector={selector} setChange={onChange}>{children}</SvgIcon>
    ) : layout === 'link' ? (
      <Link selector={selector} setChange={onChange}>{children}</Link>
    ) : layout === 'list' ? (
      <List selector={selector} setChange={onChange}>{children}</List>
    ) : layout === 'header' ? (
      <Header selector={selector} setChange={onChange}>{children}</Header>
    ) : layout === 'nav' ? (
      <Nav selector={selector} setChange={onChange}>{children}</Nav>
    ) : layout === 'aside' ? (
      <Aside selector={selector} setChange={onChange}>{children}</Aside>
    ) : layout === 'main' ? (
      <Main selector={selector} setChange={onChange}>{children}</Main>
    ) : layout === 'section' ? (
      <Section selector={selector} setChange={onChange}>{children}</Section>
    ) : layout === 'div' ? (
      <Div selector={selector} setChange={onChange}>{children}</Div>
    ) : layout === 'article' ? (
      <Article selector={selector} setChange={onChange}>{children}</Article>
    ) : layout === 'hr' ? (
      <Hr selector={selector} setChange={onChange}>{children}</Hr>
    ) : layout === 'footer' ? (
      <Footer selector={selector} setChange={onChange}>{children}</Footer>
    ) : layout === 'img' ? (
      <Image selector={selector} setChange={onChange}>{children}</Image>
    ) : layout === 'video' ? (
      <Video selector={selector} setChange={onChange}>{children}</Video>
    ) : layout === 'audio' ? (
      <Audio selector={selector} setChange={onChange}>{children}</Audio>
    ) : layout === 'input' ? (
      <Inputs selector={selector} setChange={onChange}>{children}</Inputs>
    ) : layout === 'inputgroup' ? (
      <RadioCheckbox selector={selector} setChange={onChange}>{children}</RadioCheckbox>
    ) : layout === 'fileinput' ? (
      <FileInput selector={selector} setChange={onChange}>{children}</FileInput>
    ) : layout === 'select' ? (
      <Selects selector={selector} setChange={onChange}>{children}</Selects>
    ) : layout === 'submit' || layout === 'button' ? (
      <Buttons selector={selector} setChange={onChange}>{children}</Buttons>
    ) : (
      <></>
    );
  return <>{selector && <Card>

    {Component}

    <div style={{ textAlign: 'right', marginTop: 20 }}>
      <Button type="primary" disabled={!isStyleChange}
        onClick={() => onUpdate(selector)}
      >Update</Button>
    </div>

  </Card>}</>;
}

export default LayoutStyle;