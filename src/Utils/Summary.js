export default class Summary {
    
    summary = {}
    
    add(cat, id, name) {
        if(!this.summary[cat])
            this.summary[cat] = {};
        this.summary[cat][id] = name;
    }
    
    remove(cat, id) {
        if(!this.summary[cat])
            return;
        delete this.summary[cat][id];
        if(Object.keys(this.summary[cat]).length < 1)
            delete this.summary[cat];
    }
    
    removeAll(cat) {
        if(!this.summary[cat])
            return;
        delete this.summary[cat];
    }
    
    get() {
        return this.summary;
    }
    
}