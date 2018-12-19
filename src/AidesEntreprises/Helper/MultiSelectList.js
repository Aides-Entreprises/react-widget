import React from "react";
import { View, Text, FlatList, TouchableOpacity, Keyboard } from "react-native";

class MyListItem extends React.PureComponent {

    _onPress = () => {
        Keyboard.dismiss();
        this.props.onPressItem(this.props.id, this.props.title);
    };

    render() {
        //const textColor = this.props.selected ? "red" : "black";
        if(this.props.parent === 0) {
            return (
                <TouchableOpacity>
                    <View style={ window.styles.get('multiSelectListItem') }>
                        <Text style={ window.styles.get('multiSelectListItemTextParent') }>
                            {this.props.title}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }
        else {
            return (
                <TouchableOpacity onPress={this._onPress}>
                    <View style={ window.styles.get('multiSelectListItem') }>
                        { this.props.selected &&
                            <Text style={ window.styles.get('multiSelectListItemText1') }>✓</Text>
                        }
                        { !this.props.selected &&
                            <Text style={ window.styles.get('multiSelectListItemText1') }>{' '}</Text>
                        }
                        <Text style={ window.styles.get('multiSelectListItemText2') }>
                            {this.props.title}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }
    }
}

export default class MultiSelectList extends React.PureComponent {
    
    state = { selected: (new Map(): Map < string, boolean > ) };

    _keyExtractor = (item, index) => item.id;
    
    constructor(props) {
        super(props);
        
        if(props.selected)
            this.state.selected = props.selected;
            
    }
    
    _onPressItem = (id: string, title:string) => {
        // updater functions are preferred for transactional updates
        this.setState((state) => {
            // copy the map rather than modifying state.
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id)); // toggle
            this.props.onChange(selected, {
                id: id,
                title: title,
                value: selected.get(id)
            });
            return { selected };
        });
    };

    _renderItem = ({ item }) => (
        <MyListItem
            id={item.id}
            onPressItem={this._onPressItem}
            selected={!!this.state.selected.get(item.id)}
            title={item.nom}
            parent={item.parent}
        />
    );

    render() {
        return (
            <FlatList
                
                keyboardShouldPersistTaps="always"
                data={this.props.data}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                ItemSeparatorComponent={() => <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                    }}
                    />}
            />
        );
    }
}
