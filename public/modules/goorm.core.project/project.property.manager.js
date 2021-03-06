/**
 * Copyright Sung-tae Ryu, goormDev Team. All rights reserved.
 * Code licensed under the AGPL v3 License:
 * http://www.goorm.io/intro/License
 * email : contact@goorm.io
 *       : sungtae.ryu@goorm.io
 * project_name : goormIDE
 * version: 2.0.0
 **/

goorm.core.project.property.manager = {
	treeview: null,
	tabview: null,
	treeview_id: "property_treeview",
	tabview_id: "property_tabview",
	json: {},
	plugin_data: [],

	convert_json_to_tree: function(parent, json) {
		var data = [];
		if(!$.isArray(json)) json = [json];
		json.map(function(obj){
			// console.log(obj);
			if(!obj.id) obj.id = obj.label;
			var d = {};
			d.text = obj.label;
			d.id = parent+"/"+obj.id;
			d.type = "file";
			d.parent = parent;
			d.icon = false;
			d.li_attr = {
				"id": obj.id,
				"path": d.id
			};
			d.a_attr = {
				"localization_key": obj.localization_key
			}
			data.push(d);
		});
		// console.log(data);
		return data;
	},

	append_data: function(parent, json) {
		if(json.length){
			this.treeview.tree.jstree("_append_json_data", parent, json);
		}
	},

	// create treeview structure
	create_treeview: function (json) {

		var self = this;
		var on_select = function(e, node){
			if(node.type === "file" && !node.state.disabled) {
				var id = node.li_attr.id;
				var $tabview = $("#"+self.tabview_id);
				$tabview.find(".nav-tabs > li").hide();
				$tabview.find(".nav-tabs > li[target='"+id+"']").show();
				$tabview.find(".nav-tabs > li[target='"+id+"'] > a").first().click();
			}
		};

		var project_root = [{
			text: "Property",
			state: {"opened": true},
			type: "root",
			li_attr: {"path": "Property", "folder_only": false},
			a_attr: {"localization_key": "property"},
			parent: "#",
			icon: false,
			id: this.treeview_id+"/Property"
		}, 
		{
			text: "Plugin",
			state: {"opened": true},
			type: "root",
			li_attr: {"path": "Plugin", "folder_only": false},
			a_attr: {"localization_key": "plugin"},
			parent: "#",
			icon: false,
			id: this.treeview_id+"/Plugin"
		}];

		this.json.core = self.convert_json_to_tree("Property", json.core.child);
		// console.log(project_root);

		// Create treeview
		this.treeview = new goorm.core.utility.treeview("#"+this.treeview_id, {
			project_path: "property",
			on_select: on_select,
			root_node: project_root,
			wholerow: false,
			sort: false,
			on_ready: function(){
			},
			fetch: function(path, callback){
				if(path === "Property") {
					// console.log(self.json.core);
					callback(self.json.core);
					// self.treeview.tree.jstree("redraw", true);
					// self.treeview.select_node("property_treeview/Property/System");
				}
				else if(path === "Plugin") {
					callback(self.plugin_data);
				}
				else callback(null);
			}
		});
	},

	plugin: function () {
		this.plugin_name = null;
		this.xml = null;
		this.property = {};
	}
};
