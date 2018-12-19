import React from "react";
import { View, StyleSheet } from "react-native";
import Territoire from './Search/Territoire';
import MultiSelect from './Search/MultiSelect';
import Effectif from './Search/Effectif';

export default class Search extends React.Component {

    state = {
        showSearch: true
    }

    componentDidMount() {

        window.sdk.on('resultat', () => {
            this.viewSearch(false);
        });

        window.events.on('showSearch', () => {
            this.viewSearch(true);
        });
        

    }

    viewSearch(isShow) {
        if (window.styles.isTemplate('Small')) {
            this.setState({
                showSearch: isShow
            })
        }
    }


    createWebStyle() {
        this.styles = StyleSheet.create({
            container: {
                flex: 1,
                flexDirection: 'row',

            }
        });
    }

    createMobileStyle() {
        this.styles = StyleSheet.create({
            container: {
                flex: 1
            }
        });
    }
    
    
    render() {
        if (window.styles.isTemplate('Large')) {
            return (
                <View style={window.styles.get('search')} className={ 'search' } onLayout={event => { window.events.emit('searchSize', event.nativeEvent.layout) }}>
                    <View style={window.styles.get('flexRow')}>
                        <MultiSelect item="projets" label="Projet" />
                        <Territoire />
                        <MultiSelect item="profils" label="Profil" last="true" />
                    </View>
                    <View style={window.styles.get('flexRow')}>
                        <MultiSelect item="natures" label="Nature de l'aide" />
                        <Effectif />
                        <MultiSelect item="niveaux" label="Niveau" />
                        <MultiSelect item="criteres" label="Plus de critères" last="true" />
                    </View>
                </View>
            );
        }
        else {
            let style = ['search'];
            if(!this.state.showSearch)
                style.push('hideSearch');
            return (
                <View style={window.styles.get(style)} className={ 'search' }>
                    <View>
                        <MultiSelect item="projets" label="Projet" />
                        <Territoire />
                        <MultiSelect item="profils" label="Profil" />
                        <MultiSelect item="natures" label="Nature de l'aide" />

                        <MultiSelect item="niveaux" label="Niveau" />
                        <Effectif />
                        <MultiSelect item="criteres" label="Plus de critères" />
                    </View>
                </View>
            );
        }
    }

}

/*
<Bool item="demandeur" label="Demandeur d'emploi" />
<Bool item="femme" label="Femme" />
<Bool item="senior" label="Senior" />
<Bool item="handicape" label="Handicapé" />
<Bool item="jeune" label="Jeune" />
*/
