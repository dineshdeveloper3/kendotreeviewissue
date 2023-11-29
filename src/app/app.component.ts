import { Component ,ViewChild } from '@angular/core';
import { TreeViewComponent} from '@progress/kendo-angular-treeview';
import {of} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'KendoTreeViewIssue';
  @ViewChild(TreeViewComponent, { static: false }) treeview: TreeViewComponent | undefined;
 
  public parsedData: any[] | null =[];
  public initialData: any[] =
    [{
      "typeid": 1, "id": 1, "isinactive": false, "text": "All",
      "has_children": 1,
    }
  ];

    public secondChild: any[] =
    [{
      "typeid": 2, "id": 2,"parentid":1 ,"isinactive": false, "text": "SecondChild",
      "has_children": 1,
    }];


    public thirdChild: any[] =
    [
      {
        "typeid": 1, "id": 1, "isinactive": false,"parentid":null, "text": "All",
        "has_children": 1,
      },
      {
        "typeid": 2, "id": 2,"parentid":1 ,"isinactive": false, "text": "SecondChild",
        "has_children": 1,
      },
      {
      "typeid": 3, "id": 3,"parentid":2 ,"isinactive": false, "text": "ThirdChild1",
      "has_children": 1,
    },
    {
      "typeid": 3, "id": 4,"parentid":2 ,"isinactive": false, "text": "ThirdChild2",
      "has_children": 1,
    },
    {
      "typeid": 3, "id": 5,"parentid":2 ,"isinactive": false, "text": "ThirdChild3",
      "has_children": 1
    }
  ];


   

    ngOnInit(){
      this.loadChildren = this.loadChildren.bind(this)
      this.parsedData = this.initialData;
    }

    public hasChildren(dataitem: any): any {
      if (dataitem.has_children > 0) {
        return true;
      }
      return false;
    }


    public loadChildren(dataitem: any): any {
       return of(this.secondChild);  
    }

    public handleFilter(event : any) {
      if (!event) {
        this.parsedData = this.initialData;
      } else {
        //assume thirdchild as the filterdata        
       this.parsedData =[];
       this.parsedData = this.buildHierarchy(JSON.parse(JSON.stringify(this.thirdChild)),null);
      this.treeview?.rebindChildren();
      }
  
      console.log(this.parsedData);
      //return this.parsedData;
    }
  
    public buildHierarchy(flatData: any[], parentId: number | null): any[] | null {
      const children = flatData
        .filter(item => item.parentid === parentId)
        .map(item => ({ ...item, items: this.buildHierarchy(flatData, item.id) }));
  
      return children.length > 0 ? children : null;
    }
  
    public search(items: any[], term: string): any[] {
      return items.reduce((acc, item) => {
        if (this.contains(item.text, term)) {
          acc.push(item);
        } else if (item.items && item.items.length > 0) {
          const newItems = this.search(item.items, term);
  
          if (newItems.length > 0) {
            acc.push({ text: item.text, items: newItems });
          }
        }
  
        return acc;
      }, []);
    }
  
    public contains(text: string, term: string): boolean {
      return text.toLowerCase().indexOf((term || '').toLowerCase()) >= 0;
    }
  
   
}


// @Component({
//     selector: 'app-root',
//     template: `
//     <kendo-treeview
//         [nodes]="treeNodes"
//         textField="desc"
//         kendoTreeViewExpandable
//         kendoTreeViewFlatDataBinding
//         idField="id"
//         parentIdField="parentId">
//     </kendo-treeview>
//   `
// })
// export class AppComponent {
//     public treeNodes: any[] = [
//         {
//           id: 1,
//           desc: 'Root Node 1'
//         }, {
//           id: 2,
//           parentId: 1,
//           desc: 'Child node of Root Node 2'
//         }
//     ];
// }
