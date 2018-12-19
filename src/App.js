import React from "react";
import { View, Text, Button, ScrollView, Dimensions, ActivityIndicator, StatusBar, TouchableHighlight  } from "react-native";
import Search from './AidesEntreprises/Search';
import Recap from './AidesEntreprises/Recap';
import Results from './AidesEntreprises/Results';
//import Sdk from './Sdk/Sdk';
import Sdk from 'aides-entreprises-sdk';
import EventEmitter from './Utils/EventEmitter';
import Summary from './Utils/Summary';
import Styles from './Styles/Styles';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        window.sdk = new Sdk();
        window.events = new EventEmitter();
        window.settings = {
            color1: '#073055',
            color2: '#1b4163',
            color3: '#d3e9f3'
        }
        window.summary = new Summary();
        window.styles = new Styles();
        
        this.assignDimension();
        Dimensions.addEventListener('change', (type) => {
            if(this.dimensionChangeTimeout)
                clearTimeout(this.dimensionChangeTimeout);
            this.dimensionChangeTimeout = setTimeout(() => {
                this.assignDimension();
                this.forceUpdate();
            }, 300)
        })
        
        this.state = {
            showSelector: false,
            showAutocomplete: false,
            showSearchButton: false
        }
        
        this.closeSelector = this.closeSelector.bind(this);
        this.closeAutocomplete = this.closeAutocomplete.bind(this);
    }
    
    assignDimension() {
        const {height, width} = Dimensions.get('window'); 
        if(width > 800)
            window.styles.template('Large');
        else
            window.styles.template('Small');
        window.width = width;
        window.height = height;
        console.log(width, height);
    }
    
    
    componentDidMount() {
        window.events.on('showSelector', (content) => {
            this.setState({
                showSelector: true,
                content: content
            })
        });
        
         window.events.on('hideSelector', (content) => {
            this.closeSelector();
        });
        
        window.events.on('showAutocomplete', (data) => {
            this.setState({
                showAutocomplete: true,
                content: data.content,
                autoCompleteTop: data.top
            })
        });
        
        window.events.on('hideAutocomplete', (content) => {
            this.closeAutocomplete();
        });
        
        window.events.on('executeSearch', (force = false) => {
            if(!window.styles.isTemplate('Small') || force) {
                this.viewSearchButton(false);
                window.sdk.query().execute();
            }
            else {
                window.events.emit('updateSummary');
                this.viewSearchButton(true);
            }
        });
        
        window.sdk.on('load', () => {
            this.setState({
                isLoading: true
            })
        });
        
        window.sdk.on('loadComplete', () => {
            this.setState({
                isLoading: false
            })
        });
        
        window.sdk.on('queryIsEmpty', () => {
            window.events.emit('showSearch');
            this.viewSearchButton(false);
        });
        
        window.events.on('hideSearchButton', () => {
            this.viewSearchButton(false);
        })
        
        window.events.on('showSearchButton', () => {
            this.viewSearchButton(true);
        })
        
        
        
    }
    
    viewSearchButton(isShow) {
        this.setState({
            showSearchButton: isShow
        })
    }
    
    closeSelector() {
        this.setState({
            showSelector: false,
            content: null
        })
    }
    
    closeAutocomplete() {
        this.setState({
            showAutocomplete: false,
            content: null
        })
    }


    onPressLearnMore() {

    }
    
    searchAction = () => {
        window.events.emit('executeSearch', true);
    }


    render() {
        return (
            <View style={ window.styles.get('app') } className={ 'template_' + window.styles._template }>
                <StatusBar hidden = {true} />
                <ScrollView>
                    
                    <Search />
                    
                    <Recap />
                    
                    { window.styles.isTemplate('Small') && this.state.showSearchButton &&
                        <TouchableHighlight 
                            underlayColor="#eeeeee"
                            style={ window.styles.get('searchActionButton') }
                            onPress={this.searchAction}
                            >
                                <Text style={ window.styles.get('searchActionButtonText') }>Rechercher</Text>
                        </TouchableHighlight>
                    }
                    
                    <Results />
                    
                </ScrollView>
                { this.state.showSelector &&
                    <View style={window.styles.get('selector')} className={ 'selector' }>
                        <Text></Text>
                        <Button
                            color="#000"
                            title="X"
                            onPress={this.closeSelector}>
                        </Button>
                        
                        { this.state.content }
                        
                    </View>
                }
                { this.state.showAutocomplete &&
                    <View style={[window.styles.get('autocomplete'), { top: this.state.autoCompleteTop}]} className={ 'autocomplete' }>
                        <Text></Text>
                        <Button
                            color="#000"
                            title="X"
                            onPress={this.closeAutocomplete}>
                        </Button>
                        
                        { this.state.content }
                        
                    </View>
                }
                { this.state.isLoading &&
                    <View style={ window.styles.get('loader') }>
                        <ActivityIndicator size="large" color={ window.settings.color1 } />
                    </View>
                }
            </View>
        );
    }
}

