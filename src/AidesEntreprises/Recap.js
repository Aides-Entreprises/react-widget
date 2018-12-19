import React from "react";
import { ScrollView, Text, TouchableHighlight, View, Button } from "react-native";

export default class Recap extends React.Component {
    
    state = {
        items: [],
        showBack: false
    }
    
    async componentDidMount() {
        window.events.on('updateSummary', () => {
            this.summary = window.summary.get()
            this.showSummary();
        })
        
        window.sdk.on('resultat', () => {
            this.viewBack(true);
        });

        window.events.on('showSearch', () => {
            this.viewBack(false);
        });
    }
    
    showSummary() {
        let items = []
        Object.keys(this.summary).map((key) => {
            items.push({
                type: 'Cat',
                label: key
            })
            Object.keys(this.summary[key]).map((itemKey) => {
                items.push({
                    type: 'Element',
                    label: this.summary[key][itemKey],
                    cat: key,
                    id: itemKey
                })
            })
        })
        this.setState({
            items: items
        })
    }
    
    itemCat(item, index) {
        return (
            <TouchableHighlight style={ window.styles.get('recapCat') } key={ index }>
                <Text style={ window.styles.get('recapCatText') }>{ item.label } :</Text>
            </TouchableHighlight>
        )
    }
    
    itemElement(item, index) {
        return (
            <TouchableHighlight style={ window.styles.get('recapElement') } key={ index } underlayColor="#dddddd" onPress={ () => { this.remove(item.cat, item.id) } }>
                <Text>{ item.label } X</Text>
            </TouchableHighlight>
        )
    }
    
    remove(cat, id) {
        window.events.emit(cat + 'Remove', id);
        window.summary.remove(cat, id);
        this.summary = window.summary.get()
        this.showSummary();
        window.sdk.query().remove(cat, id);
        if (window.styles.isTemplate('Small') && !this.state.showBack) {
            console.log('isEmptyQuery', window.sdk.query().isEmptyQuery())
            if(window.sdk.query().isEmptyQuery())
                window.events.emit('hideSearchButton');
        }
        else {
            window.sdk.query().execute();
        }
    }
    
    viewBack(isShow) {
        if (window.styles.isTemplate('Small')) {
            this.setState({
                showBack: isShow
            })
        }
    }
    
    back = () => {
        window.events.emit('showSearch');
        if (window.styles.isTemplate('Small') && !window.sdk.query().isEmptyQuery()) {
             window.events.emit('showSearchButton');
        }
    }
    
    render() {
        return (
            <View className={ 'recap_container' } onLayout={event => { window.events.emit('recapSize', event.nativeEvent.layout) }}>
                { this.state.showBack &&
                    <TouchableHighlight style={ window.styles.get('backButton') } onPress={ this.back } className={ 'backButton' }>
                        <Text style={ window.styles.get('backButtonText') }>Retour</Text>
                    </TouchableHighlight>
                }
                <ScrollView className={ 'recap' } horizontal={ true } style={ window.styles.get('recap') }>
                    { this.state.items.map((item, index) => {
                        return this['item' + item.type](item, index)
                    })}
                </ScrollView>
            </View>
        )
    }
    
}