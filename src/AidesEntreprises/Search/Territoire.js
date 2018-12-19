import React from "react";
import { View, TextInput, Text, Keyboard } from "react-native";
import MultiSelectList from "../Helper/MultiSelectList";

export default class Territoire extends React.Component {


    state = {
        text: 'Localisation'
    }
    
    componentDidMount() {
        window.events.on('territoireRemove', (id) => {
            this.setState({ text: 'Localisation' });
        });
    }
    
    onLayout(layout) {
        this.layout = layout;
    }
    
    change = (selected, item) => {
        console.log(selected);
        window.events.emit('hideAutocomplete');
        window.summary.removeAll('territoire');
        let territoire;
        selected.forEach((value, key) => {
            territoire = key;
        });
        if(item.value)
            window.summary.add('territoire', item.id, item.title);
        this.setState({
            text: item.title
        })
        window.sdk.query().territoire(territoire);
        window.events.emit('executeSearch');
    }
    
    onChangeText(text) {
        if(this.timeout)
            clearTimeout(this.timeout);
        this.setState({text});
        this.timeout = setTimeout(async () => {
            let content = await this.renderAutoComplete();
            window.events.emit('showAutocomplete', {
                content: content,
                top: (this.layout.y + this.layout.height)
            })
        }, 500);
    }
    
    async renderAutoComplete() {
        this.data = await window.sdk.rechercheTerritoiresParNom(this.state.text);
        return (
            <View>
                <MultiSelectList 
                    data={ this.data }
                    onChange={ this.change }
                />
            </View>
        );
    }

    render() {
        return (
            <View style={ window.styles.get('searchItem') } onLayout={event => { this.onLayout(event.nativeEvent.layout); }}>
                <TextInput
                    style={ window.styles.get('searchItemInput') }
                    onChangeText={(text) => { this.onChangeText(text) } }
                    value={this.state.text}
                    clearTextOnFocus={ true }
                    autoCorrect={ false }
                />
            </View>
        );
    }

}
