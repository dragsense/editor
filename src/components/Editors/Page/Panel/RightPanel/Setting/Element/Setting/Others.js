import React from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, theme, Form, Input, InputNumber, Select, Checkbox, Switch } from 'antd';

const { Option } = Select;
const { Panel } = Collapse;

const scopes = ['row', 'col', 'rowgroup', 'colgroup'];

const dirs = ['ltr', 'rtl', 'auto'];

const targets = ['_self', '_blank', '_parent', '_top'];

const liTypes = ['a', 'A', 'i', 'I', '1'];

const imgLoading = ['eager', 'lazy'];

const prelaods = ['none', 'metadata', 'auto', ''];

const buttonTypes = ['submit', 'reset', 'button'];

const inputTypes = ['button', 'checkbox', 'color', 'date', 'datetime-local', 'email', 'file', 'hidden', 'month', 'number', 'password', 'radio', 'range', 'reset', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week'];

const autocompletes = [
    "on",
    "off",
    "name",
    "honorific-prefix",
    "given-name",
    "additional-name",
    "family-name",
    "honorific-suffix",
    "nickname",
    "username",
    "new-password",
    "current-password",
    "organization-title",
    "organization",
    "street-address",
    "address-line1",
    "address-line2",
    "address-line3",
    "address-level4",
    "address-level3",
    "address-level2",
    "address-level1",
    "country",
    "country-name",
    "postal-code",
    "cc-name",
    "cc-given-name",
    "cc-additional-name",
    "cc-family-name",
    "cc-number",
    "cc-exp",
    "cc-exp-month",
    "cc-exp-year",
    "cc-csc",
    "cc-type",
    "transaction-currency",
    "transaction-amount",
    "language",
    "bday",
    "bday-day",
    "bday-month",
    "bday-year",
    "sex",
    "url",
    "photo",
];

const acceptOptions = ['doc', 'docx', 'xml', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];


const Others = ({ state, onChnageAttribute, onRemove }) => {


    return (
        <>
            <Form.Item label="Dir">
                <Select value={state.attributes['dir']?.value} onChange={(value) => { onChnageAttribute('dir', value) }}>
                    {dirs.map(d => <Option key={d} value={d} label={d} />)}
                </Select>
            </Form.Item>

            {(state.tagName == 'td' || state.tagName == 'th') && <><Form.Item label="Col Span">
                <InputNumber
                    min={1}
                    max={1000}
                    value={state.attributes['colspan']?.value}
                    placeholder="colspan"
                    name="colspan"
                    onChange={(e) => { e.preventDefault(); onChnageAttribute('colspan', e.target.value) }} />
            </Form.Item>

                <Form.Item label="Row Span">
                    <InputNumber
                        min={0}
                        max={65534}
                        value={state.attributes['rowspan']?.value}
                        placeholder="rowspan"
                        name="rowspan"
                        onChange={(e) => { e.preventDefault(); onChnageAttribute('rowspan', e.target.value) }} />
                </Form.Item>

                <Form.Item label="Headers">
                    <Input value={state.attributes['headers']?.value} placeholder="headers" name="headers" onChange={(e) => { e.preventDefault(); onChnageAttribute('headers', e.target.value) }} />
                </Form.Item>
            </>
            }


            {state.tagName == 'th' && <>
                <Form.Item label="Abbr">
                    <Input value={state.attributes['abbr']?.value} placeholder="abbr" name="abbr" onChange={(e) => { e.preventDefault(); onChnageAttribute('abbr', e.target.value) }} />
                </Form.Item>

                <Form.Item label="Scope">
                    <Select value={state.attributes['scope']?.value} onChange={(value) => { onChnageAttribute('scope', value) }}>
                        {scopes.map(s => <Option key={s} value={s} label={s} />)}
                    </Select>
                </Form.Item>
            </>
            }

            {state.tagName == 'a' && <>
                <Form.Item label="Download">
                    <Input value={state.attributes['download']?.value} placeholder="download" name="download" onChange={(e) => { e.preventDefault(); onChnageAttribute('download', e.target.value) }} />
                </Form.Item>

                <Form.Item label="Target">
                    <Select value={state.attributes['target']?.value} onChange={(value) => { onChnageAttribute('target', value) }}>
                        {targets.map(t => <Option key={t} value={t} label={t} />)}
                    </Select>
                </Form.Item>

                <Form.Item label="Rel">
                    <Input value={state.attributes['rel']?.value} placeholder="rel" name="rel" onChange={(e) => { e.preventDefault(); onChnageAttribute('rel', e.target.value) }} />
                </Form.Item>
            </>
            }

            {state.tagName == 'ol' && <>
                <Form.Item label="isReversed?">
                    <Checkbox checked={state.attributes['reversed']?.value}
                        onChange={(e) => { e.preventDefault(); onChnageAttribute('reversed', !state.attributes['download']?.value) }}
                    >
                        Yes
                    </Checkbox>
                </Form.Item>

                <Form.Item label="Download">
                    <Input value={state.attributes['download']?.value} placeholder="download" name="download" onChange={(e) => { e.preventDefault(); onChnageAttribute('download', e.target.value) }} />
                </Form.Item>

                <Form.Item label="Start">
                    <InputNumber

                        value={state.attributes['start']?.value}
                        placeholder="start"
                        name="start"
                        onChange={(e) => { e.preventDefault(); onChnageAttribute('start', e.target.value) }} />
                </Form.Item>

                <Form.Item label="Type">
                    <Select value={state.attributes['type']?.value} onChange={(value) => { onChnageAttribute('type', value) }}>
                        {liTypes.map(t => <Option key={t} value={t} label={t} />)}
                    </Select>
                </Form.Item>
            </>
            }

            {state.tagName == 'li' && <>


                <Form.Item label="Value">
                    <InputNumber

                        value={state.attributes['value']?.value}
                        placeholder="value"
                        name="value"
                        onChange={(e) => { e.preventDefault(); onChnageAttribute('value', e.target.value) }} />
                </Form.Item>


            </>
            }

            {state.tagName == 'blockquote' && <>


                <Form.Item label="Cite">
                    <Input value={state.attributes['cite']?.value} placeholder="cite" name="cite" onChange={(e) => { e.preventDefault(); onChnageAttribute('cite', e.target.value) }} />
                </Form.Item>



            </>
            }

            {(state.tagName == 'img' || state.tagName == 'video') && <>
                <Form.Item label="Width">
                    <InputNumber

                        value={state.attributes['width']?.value}
                        placeholder="width"
                        name="width"
                        onChange={(e) => { e.preventDefault(); onChnageAttribute('width', e.target.value) }} />
                </Form.Item>

                <Form.Item label="Height">
                    <InputNumber

                        value={state.attributes['height']?.value}
                        placeholder="height"
                        name="height"
                        onChange={(e) => { e.preventDefault(); onChnageAttribute('height', e.target.value) }} />
                </Form.Item> </>
            }



            {state.tagName == 'video' || state.tagName == 'audio' && <>

                <Form.Item label="Auto Play?">
                    <Checkbox checked={state.attributes['autoplay']?.value}
                        onChange={(e) => { e.preventDefault(); onChnageAttribute('autoplay', !state.attributes['autoplay']?.value) }}
                    >
                        Yes
                    </Checkbox>
                </Form.Item>

                <Form.Item label="Controls?">
                    <Checkbox checked={state.attributes['controls']?.value}
                        onChange={(e) => { e.preventDefault(); onChnageAttribute('controls', !state.attributes['controls']?.value) }}
                    >
                        Yes
                    </Checkbox>
                </Form.Item>

                <Form.Item label="Loop?">
                    <Checkbox checked={state.attributes['loop']?.value}
                        onChange={(e) => { e.preventDefault(); onChnageAttribute('loop', !state.attributes['loop']?.value) }}
                    >
                        Yes
                    </Checkbox>
                </Form.Item>

                <Form.Item label="Muted?">
                    <Checkbox checked={state.attributes['muted']?.value}
                        onChange={(e) => { e.preventDefault(); onChnageAttribute('muted', !state.attributes['muted']?.value) }}
                    >
                        Yes
                    </Checkbox>
                </Form.Item>




                <Form.Item label="Preload">
                    <Select value={state.attributes['preload']?.value} onChange={(value) => { onChnageAttribute('preload', value) }}>
                        {prelaods.map(t => <Option key={t} value={t} label={t} />)}
                    </Select>
                </Form.Item>
            </>
            }
            {state.tagName == 'video' && <>

                <Form.Item label="Custom poster">
                    <Input value={state.attributes['poster']?.value} placeholder="poster" name="srposterc" onChange={(e) => { e.preventDefault(); onChnageAttribute('poster', e.target.value) }} />
                </Form.Item>

                <Form.Item label="Plays Inline?">
                    <Checkbox checked={state.attributes['playsinline']?.value}
                        onChange={(e) => { e.preventDefault(); onChnageAttribute('playsinline', !state.attributes['playsinline']?.value) }}
                    >
                        Yes
                    </Checkbox>
                </Form.Item></>}

            {state.tagName == 'img' && <>


                <Form.Item label="Alt">
                    <Input value={state.attributes['alt']?.value} placeholder="alt" name="alt" onChange={(e) => { e.preventDefault(); onChnageAttribute('alt', e.target.value) }} />
                </Form.Item>



                <Form.Item label="Loading">
                    <Select value={state.attributes['loading']?.value} onChange={(value) => { onChnageAttribute('loading', value) }}>
                        {imgLoading.map(t => <Option key={t} value={t} label={t} />)}
                    </Select>
                </Form.Item>
            </>
            }

            {(state.tagName == 'button') && <>
                <Form.Item label="Type">
                    <Select value={state.attributes['type']?.value} onChange={(value) => { onChnageAttribute('type', value) }}>
                        {buttonTypes.map(t => <Option key={t} value={t} label={t} />)}
                    </Select>
                </Form.Item></>}


            {(state.tagName == 'button' || state.tagName == 'input' || state.tagName == 'select') && <>

                <Form.Item label="Disabled?">
                    <Checkbox checked={state.attributes['disabled']?.value}
                        onChange={(e) => { e.preventDefault(); onChnageAttribute('disabled', !state.attributes['disabled']?.value) }}
                    >
                        Yes
                    </Checkbox>
                </Form.Item>


                <Form.Item label="Name">
                    <Input value={state.attributes['name']?.value} placeholder="name" name="name" onChange={(e) => { e.preventDefault(); onChnageAttribute('name', e.target.value) }} />
                </Form.Item>

                <Form.Item label="Value">
                    <Input value={state.attributes['value']?.value} placeholder="value" name="value" onChange={(e) => { e.preventDefault(); onChnageAttribute('value', e.target.value) }} />
                </Form.Item>

                <Form.Item label="Auto Focus?">
                    <Checkbox checked={state.attributes['autofocus']?.value}
                        onChange={(e) => { e.preventDefault(); onChnageAttribute('autofocus', !state.attributes['autofocus']?.value) }}
                    >
                        Yes
                    </Checkbox>
                </Form.Item>


            </>
            }

            {(state.tagName == 'select') && <>
                <Form.Item label="Multiple">
                    <Switch checked={state.attributes['multiple']?.value} onChange={(value) => { onChnageAttribute('multiple', value) }} />
                </Form.Item>
            </>}

            {(state.tagName == 'input' || state.tagName == 'select') && <>
                <Form.Item label="Required">
                    <Switch checked={state.attributes['required']?.value} onChange={(value) => { onChnageAttribute('required', value) }} />
                </Form.Item>

                <Form.Item label="Size">
                    <InputNumber value={state.attributes['size']?.value} onChange={(value) => { onChnageAttribute('size', value) }} />
                </Form.Item>

                {!['checkbox', 'radio', 'file'].includes(state.attributes['type']?.value) && <>

                    <Form.Item label="Auto Complete">
                        <Input value={state.attributes['autocomplete']?.value} placeholder="autocomplete" name="autocomplete" onChange={(e) => { e.preventDefault(); onChnageAttribute('autocomplete', e.target.value) }} />
                    </Form.Item>

                </>}

            </>}


            {state.tagName == 'input' && <>


                <Form.Item label="Type">
                    <Select showSearch value={state.attributes['type']?.value} onChange={(value) => { onChnageAttribute('type', value) }}>
                        {inputTypes.map(t => <Option key={t} value={t} label={t} />)}
                    </Select>
                </Form.Item>

                {['email', 'file'].includes(state.attributes['type']?.value) && <>

                    <Form.Item label="Multiple">
                        <Switch checked={state.attributes['multiple']?.value} onChange={(value) => { onChnageAttribute('multiple', value) }} />
                    </Form.Item>

                </>}

                {state.attributes['type']?.value === 'file' && <>
                    <Form.Item label="Accept">
                        <Select
                            mode="tags"
                            placeholder="accept"
                            value={state.attributes['accept']?.value?.split(",")}
                            onChange={(values) => {
                                const acceptString = values.join(",");
                                onChnageAttribute('accept', acceptString);
                            }}
                        >
                            {acceptOptions.map(option => (
                                <Select.Option key={option} value={option}>
                                    {option}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </>}

                {!['checkbox', 'radio', 'file'].includes(state.attributes['type']?.value) && <>

                    <Form.Item label="Auto Complete">

                        <Select showSearch value={state.attributes['autocomplete']?.value} onChange={(value) => { onChnageAttribute('autocomplete', value) }}>
                            {autocompletes.map(t => <Option key={t} value={t} label={t} />)}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Placeholder">
                        <Input value={state.attributes['placeholder']?.value} placeholder="placeholder" name="placeholder" onChange={(e) => { e.preventDefault(); onChnageAttribute('placeholder', e.target.value) }} />
                    </Form.Item>

                </>}


                {['checkbox', 'radio'].includes(state.attributes['type']?.value) && <>

                    <Form.Item label="Checked">
                        <Switch checked={state.attributes['checked']?.value} onChange={(value) => { onChnageAttribute('checked', value) }} />
                    </Form.Item>

                </>}



                {['date', 'month', 'week', 'time', 'datetime-local', 'number', 'range'].includes(state.attributes['type']?.value) && <>

                    <Form.Item label="Min">
                        <InputNumber value={state.attributes['min']?.value} onChange={(value) => { onChnageAttribute('min', value) }} />
                    </Form.Item>

                    <Form.Item label="Max">
                        <InputNumber value={state.attributes['max']?.value} onChange={(value) => { onChnageAttribute('max', value) }} />
                    </Form.Item>

                    <Form.Item label="Step">
                        <InputNumber value={state.attributes['step']?.value} onChange={(value) => { onChnageAttribute('step', value) }} />
                    </Form.Item>

                </>}

                {['text', 'search', 'url', 'tel', 'email', 'password'].includes(state.attributes['type']?.value) && <>

                    <Form.Item label="Min Length">
                        <InputNumber value={state.attributes['minlength']?.value} onChange={(value) => { onChnageAttribute('minlength', value) }} />
                    </Form.Item>


                    <Form.Item label="Max Length">
                        <InputNumber value={state.attributes['maxlength']?.value} onChange={(value) => { onChnageAttribute('maxlength', value) }} />
                    </Form.Item>

                </>}


                <Form.Item label="Pattern">
                    <Input value={state.attributes['pattern']?.value} placeholder="pattern" name="pattern" onChange={(e) => { e.preventDefault(); onChnageAttribute('pattern', e.target.value) }} />
                </Form.Item>





                <Form.Item label="Read Only">
                    <Switch checked={state.attributes['readonly']?.value} onChange={(value) => { onChnageAttribute('readonly', value) }} />
                </Form.Item>



                <Form.Item label="Spellcheck">
                    <Switch checked={state.attributes['spellcheck']?.value} onChange={(value) => { onChnageAttribute('spellcheck', value) }} />
                </Form.Item>



            </>
            }

            {state.tagName === 'label' && <>
                <Form.Item label="For">
                    <Input
                        value={state.attributes['for']?.value}
                        placeholder="for"
                        name="for"
                        onChange={(e) => {
                            e.preventDefault();
                            onChnageAttribute('for', e.target.value)
                        }}
                    />
                </Form.Item>


            </>}

            {(state.tagName == 'input' || state.tagName == 'label') && <>

                <Form.Item label="Access Key">
                    <Input value={state.attributes['accesskey']?.value} placeholder="accesskey" name="accesskey" onChange={(e) => { e.preventDefault(); onChnageAttribute('accesskey', e.target.value) }} />
                </Form.Item>

                <Form.Item label="TabIndex">
                    <InputNumber value={state.attributes['tabindex']?.value} onChange={(value) => { onChnageAttribute('tabindex', value) }} />
                </Form.Item>

            </>
            }


        </>

    );
};

export default Others;