import React from "react";
import { View, Text, TouchableOpacity, FlatList, Divider, TouchableHighlight, Linking, Platform } from "react-native";
const Entities = require('html-entities').AllHtmlEntities;

export default class Results extends React.Component {

    state = {
        aides: [],
        height: window.height - 80,
        showNoResults: false
    }
    page = 0;
    entities = new Entities();
    showMore = this.showMore.bind(this);
    searchHeight = 0;
    searchRecap = 0;
    processedHeight = false;

    async componentDidMount() {
        window.sdk.on('resultat', async(aides) => {
            window.events.emit('updateSummary');
            await this.setState({
                aides: aides.data,
                showMore: aides.showMore,
                showNoResults: false
            })
            if (aides.meta.total === '0') {
                await this.setState({
                    showNoResults: true
                })
            }
            console.log(this.state.showNoResults);
        })

        window.events.on('showSearch', () => {
            console.log('showSearch')
            this.setState({
                aides: [],
                showMore: false,
                showNoResults: false
            })
        });


        window.events.on('searchSize', (layout) => {
            this.searchHeight = layout.height;
            if (window.styles.isTemplate('Large')) {
                this.processHeight();
            }
        });


        window.events.on('recapSize', (layout) => {
            this.recapHeight = layout.height;
            if (window.styles.isTemplate('Small')) {
                console.log('recapSize', layout.height)
                /*this.setState({
                    height: window.height - 150
                })*/
            }
            else {
                this.processHeight();
            }
        });


    }

    processHeight() {
        if (!this.processedHeight && this.recapHeight > 0 && this.searchHeight > 0) {
            console.log(window.height - this.recapHeight - this.searchHeight)
            console.log(window.height, this.recapHeight, this.searchHeight)
            this.setState({
                height: window.height - this.recapHeight - this.searchHeight
            })
            this.processedHeight = true;
        }
    }

    shorten(str, maxLen, separator = ' ') {
        if (str.length <= maxLen) return str;
        return str.substr(0, str.lastIndexOf(separator, maxLen)) + '...';
    }

    onPress(id) {
        if (Platform.OS !== 'web') {
            const url = 'https://aides-entreprises.fr/aide/' + id;
            Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url); 
                }
                else {
                    console.log('Don\'t know how to open URI: ' + url);
                }
            });
        }
    }
// 
    renderItem = ({ item }) => (
        <TouchableOpacity  href={'https://aides-entreprises.fr/aide/' + item.id_aid} accessibilityRole="link" target="_blank" onPress={() => this.onPress(item.id_aid) }>
            <View style={ window.styles.get('aideResultRow') }>
                <Text style={ window.styles.get('aideResultTitle') }>
                    { this.entities.decode(item.aid_nom) }
                </Text>
                <Text>
                    { this.shorten(this.entities.decode(item.aid_objet), 350) }
                </Text>
            </View>
        </TouchableOpacity>
    );

    onScrollHandler = () => {
        this.setState({
            page: this.state.page + 1
        }, () => {
            console.log('okk')
            //this.fetchRecords(this.state.page);
        });
    }

    async showMore() {
        this.page++;
        window.sdk.query().offset(this.page)
        let res = await window.sdk.query().execute(false);
        this.setState({
            aides: [...this.state.aides, ...res.data]
        });
    }

    render() {
        if (this.state.aides.length < 1 && !this.state.showNoResults)
            return null;
        else if (this.state.aides.length < 1 && this.state.showNoResults)
            return (
                <View style={[window.styles.get(['results', 'noresults']), { height: this.state.height }]} className={ 'results noresults' }>
                    <Text  style={ window.styles.get('noresultsText') } className={ 'noresultsText' }>Votre recherche n'a donné aucun résultat</Text>
                </View>
            );
        else {
            return (
                <View style={[window.styles.get('results'), { height: this.state.height }]} className={ 'results' }>
                    <FlatList
                       data={this.state.aides}
                       renderItem={this.renderItem}
                       keyExtractor={item => item.id_aid}
                       ItemSeparatorComponent={() => <View
                        style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                        }}
                        />}
                    />
                    { this.state.showMore &&
                        <TouchableHighlight style={ window.styles.get('showMoreButton') } onPress={ this.showMore } className={ 'showMoreButton' }>
                            <Text style={ window.styles.get('showMoreButtonText') }>Voir plus</Text>
                        </TouchableHighlight>
                    }
                </View>
            );
        }

    }

}
