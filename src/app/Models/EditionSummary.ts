import { Edition }  from './Edition';

export class EditionSummary extends Edition {
        
    //Keys: url, name - value is string
    authors: any[];

    //Keys: name - value is string
    publishers: any[];
    publishers_list: string[];

    //Keys: name - value is string
    publish_places: any[];
    publish_places_list: string[];

    constructor() {
        super();
    }

    flattenAttributes(): void {
        super.flattenAttributes();

        for (let i = 0; i < (this.publishers?this.publishers.length: 0); i++) {
            this.publishers_list = [];
            this.publishers_list.push(this.publishers[i]["name"]);
        }

        for (let i = 0; i < (this.publish_places? this.publish_places.length : 0); i++) {
            this.publish_places_list = []
            this.publish_places_list.push(this.publish_places[i]["name"]);
        }

        for (let i = 0; i < (this.authors? this.authors.length : 0); i++) {
            this.author_list = [];
            this.author_list.push(this.authors[i]["name"]);
        }
    }
}