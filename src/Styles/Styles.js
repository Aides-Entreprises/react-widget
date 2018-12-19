import { StyleSheet } from "react-native";

export default class Styles {

    styles = StyleSheet.create({
        app: {
            flex: 1
        },
        search: {
            backgroundColor: window.settings.color2
        },
        hideSearch: {
            position:'absolute',
            left: - window.width,
            top: - window.height,
            zIndex: 0
        },
        loader: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: 110,
            backgroundColor: 'rgba(254, 254, 254, 0.3)'
        },
        selector: {
            position: 'absolute',
            minWidth: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            zIndex: 100
        },
        recap: {
            backgroundColor: window.settings.color1,
            flex: 1,
            flexDirection: 'row'
        },
        recapCat: {
            height: 35,
            justifyContent: 'center',
            margin:5,
            padding:5
        },
        recapCatText: {
            color: 'white'
        },
        recapElement: {
            height: 35,
            borderRadius: 5,
            backgroundColor: 'white',
            margin:5,
            padding:5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        recapText: {
            height: 35,
            borderRadius: 5,
            backgroundColor: 'white'
        },
        autocomplete: {
            position: 'absolute',
            minWidth: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            zIndex: 100
        },
        flexRow: {
            flex: 1,
            flexDirection: 'row',
            marginBottom: 10
        },
        searchItem: {
            flex: 1,
            height: 35
        },
        searchItemButton: {
            height: 35,
            borderRadius: 5,
            backgroundColor: 'white',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        searchItemButtonText: {
            fontWeight: 'bold'
        },
        searchItemPicker: {
            height: 35
        },
        searchItemInput: {
            height: 35,
            borderColor: 'gray',
            backgroundColor: 'white',
            borderWidth: 1,
            padding: 4
        },
        searchItemLarge: {
            marginRight: 10
        },
        searchItemLastLarge: {
            marginRight: 0
        },
        searchItemSmall: {
            marginBottom: 10
        },
        multiSelectListItem: {
            padding: 10,
            flex: 1,
            flexDirection: 'row'
        },
        multiSelectListItemText1: {
            width: 20,
            fontSize: 15
        },
        multiSelectListItemTextParent: {
            width: 20,
            fontSize: 15,
            fontWeight: 'bold',
            width: '100%'
        },
        multiSelectListItemText2: {
            fontSize: 15
        },
        aideResultRow: {
            padding: 10
        },
        aideResultTitle: {
            fontWeight: 'bold',
            fontSize: 16
        },
        results: {
            backgroundColor:'#ffffff'
        },
        searchActionButton: {
            backgroundColor: window.settings.color2,
            margin:20,
            padding:15,
            justifyContent: 'center',
            alignItems: 'center'
        },
        searchActionButtonText: {
            color:'#ffffff',
            fontWeight: 'bold',
        },
        noresults: {
            justifyContent: 'center',
            alignItems: 'center'
        },
        noresultsText: {
            fontSize: 15,
            fontWeight: 'bold'
        },
        backButton: {
            width: '100%',
            backgroundColor: window.settings.color2,
            justifyContent: 'center',
            alignItems: 'center',
            height: 35
        },
        backButtonText: {
            fontSize: 15,
            fontWeight: 'bold',
            color: '#ffffff'
        },
        showMoreButton: {
            width: '100%',
            backgroundColor: window.settings.color2,
            justifyContent: 'center',
            alignItems: 'center',
            height: 35
        },
        showMoreButtonText: {
            fontSize: 15,
            fontWeight: 'bold',
            color: '#ffffff'
        }
        /*recap_container: {
            position: 'absolute',
            zIndex: 95
        }*/
    });


    get(key) {
        if (typeof key === 'object') {
            let tmp = [];
            for (var i in key) {
                tmp.push(this._get(key[i]))
            }
            return [].concat(...tmp);
        }
        else
            return this._get(key);
    }

    _get(key) {
        if (this.styles[key + this._template]) {
            return [
                this.styles[key],
                this.styles[key + this._template]
            ];
        }
        else
            return this.styles[key];
    }

    template(template) {
        //Large ou Small
        this._template = template;
    }

    isTemplate(template) {
        if (this._template === template)
            return true;
        else
            return false;
    }

}
