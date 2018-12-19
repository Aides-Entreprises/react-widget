import React from "react";
import { View, Picker, Platform, TouchableHighlight, Text, ActionSheetIOS } from "react-native";

export default class Effectif extends React.Component {

    state = { effectif: '' }
    choices = [
        'Micro',
        'Moins de 10 salariés',
        '10 à 49 salariés',
        '50 à 249 salariés',
        '250 salariés ou plus',
        'Annulé'
    ];
    idMap = {
        0: 1,
        1: 3,
        2: 4,
        3: 5,
        4: 6,
        5: ''
    }
    
    componentDidMount() {
        window.events.on('effectifRemove', (id) => {
            this.setState({ effectif: '' });
        });
    }

    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    updateEffectif = async(effectif) => {
        await this.setState({ effectif: effectif });
        this.loadByEffectif();
    }

    showActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions({
                options: this.choices,
                cancelButtonIndex: (this.choices.length - 1)
            },
            (buttonIndex) => {
                this.state.effectif = this.idMap[buttonIndex];
                this.loadByEffectif();
            });
    }

    loadByEffectif() {
        window.summary.removeAll('effectif');
        if (this.state.effectif != '') {
            let label = '';
            for (var i in this.idMap) {
                if (this.idMap[i] == this.state.effectif) {
                    label = this.choices[i];
                    break;
                }
            }
            window.summary.add('effectif', this.state.effectif, label)
            window.sdk.query().effectif(this.state.effectif);
            window.events.emit('executeSearch');
        }
        else {
            window.sdk.query().effectif(false);
            window.events.emit('executeSearch');
        }

    }


    render() {
        if (Platform.OS === 'ios') {
            return (
                <View style={ window.styles.get('searchItem') }>
                    
                    <TouchableHighlight 
                        underlayColor="#dddddd"
                        style={ window.styles.get('searchItemButton') }
                        onPress={this.showActionSheet}
                    >
                        <Text style={ window.styles.get('searchItemButtonText') }>Effectif de l'entreprise</Text>
                    </TouchableHighlight>
                </View>
            )
        }
        else {
            return (
                <View style={ window.styles.get('searchItem') } className={ 'searchItem' }>
                    <Picker style={ window.styles.get('searchItemPicker') } selectedValue={this.state.effectif} onValueChange={this.updateEffectif}>
                        <Picker.Item label="Effectif de l'entreprise" value="" />
                        { this.choices.map((value, index) => { 
                            return <Picker.Item key={ index } label={ value } value={ this.idMap[index] }  />
                        })}
                    </Picker>
                </View>
            );
        }
    }



}
