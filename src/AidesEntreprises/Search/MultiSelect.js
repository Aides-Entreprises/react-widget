import React from "react";
import { View, TouchableHighlight, Text } from "react-native";
import MultiSelectList from "../Helper/MultiSelectList";

export default class MultiSelect extends React.Component {
        
    selected = null;
    
    toggleMenu = async () => {
        let content = await this.content();
        window.events.emit('showSelector', content);
    }
    
    change = (selected, item) => {
        window.events.emit('hideSelector');
        this.selected = selected;
        let tmp = [];
        selected.forEach((value, key) => {
            if(value)
                tmp.push(key);
        });
        if(item.value)
            window.summary.add(this.props.item, item.id, item.title)
        else
            window.summary.remove(this.props.item, item.id)
        window.sdk.query()[this.props.item](tmp);
        window.events.emit('executeSearch');
    }
    
    componentDidMount() {
        window.events.on(this.props.item + 'Remove', (id) => {
            try {
                this.selected.set(id, false);
            }
            catch(err) {
                console.log(err);
            }
        });
    }

    async content() {
        this.data = await window.sdk[this.props.item]();
        return (
            <View style={ window.styles.get('searchMultiSelect') }>
                <MultiSelectList 
                    selected={ this.selected }
                    data={ this.data }
                    onChange={ this.change }
                />
                
            </View>
        );
    }

    render() {
        let style = ['searchItem'];
        if(this.props.last) 
            style.push('searchItemLast');
        return (
            <View style={ window.styles.get(style) } className={ style.join(' ') }>
                <TouchableHighlight 
                    underlayColor="#eeeeee"
                    style={ window.styles.get('searchItemButton') }
                    onPress={this.toggleMenu}
                >
                    <Text style={ window.styles.get('searchItemButtonText') }>{ this.props.label }</Text>
                </TouchableHighlight>
                
            </View>
        );
    }
    
}