export default class OdataService {
    createOdataQuery(filter, getAll = false) {
      var searchQuery = {
        $count: true,
        $skip: filter.first || 0,
        $top: filter.rows || 10,
      };
      if (!filter.sortField) {
        filter.sortField = "Id";
        filter.sortOrder = -1;
      }
      if (getAll) {
        searchQuery = {
          $count: true,
        };
      }
  
      if (filter.sortField) {
        searchQuery.$orderBy =
          filter.sortField.replaceAll(".", "/") +
          " " +
          (filter.sortOrder == -1 ? "desc" : "asc");
      }
      var queryFilters = [];
      var querySelect = "";
      var queryExpand = "";
      for (var element in filter.filters) {
        if (
          Object.prototype.hasOwnProperty.call(
            filter.filters[element],
            "constraints"
          ) == true
        ) {
          for (var i = 0; i < filter.filters[element].constraints.length; i++) {
            if (
              filter.filters[element].constraints[i].value === null ||
              filter.filters[element].constraints[i].value === "" ||
              filter.filters[element].constraints[i].value === undefined
            ) {
              continue;
            }
            queryFilters.push(
              this.setFilter(element, filter.filters[element].constraints[i])
            );
          }
        }
  
        if (
          filter.filters[element].value === null ||
          filter.filters[element].value === "" ||
          filter.filters[element].value === undefined
        ) {
          continue;
        }
        queryFilters.push(this.setFilter(element, filter.filters[element]));
      }
      if (queryFilters.filter((s) => s != "").length > 0) {
        searchQuery.$filter = queryFilters.filter((s) => s != "").join(" and ");
      }
      if (filter.select) {
        querySelect += "" + filter.select;
        searchQuery.$select = querySelect;
      }
      if (filter.expand) {
        queryExpand += "" + filter.expand;
        searchQuery.$expand = queryExpand;
      }
      // console.log(searchQuery);
      var urlparams = new URLSearchParams(searchQuery).toString();
      return urlparams;
    }
    formatDate(value) {
      // console.log(value);
      return value.toISOString();
    }
    setFilter(element, filter) {
      var val = filter.value;
      switch (Object.prototype.toString.call(filter.value)) {
        case "[object String]":
          val = "'" + filter.value + "'";
          break;
        case "[object Date]":
          val = this.formatDate(filter.value);
          break;
        case "[object Number]":
          val = filter.value;
          break;
      }
      element = element.replaceAll(".", "/");
      switch (filter.matchMode) {
        case "contains":
          return "contains(" + element + "," + val + ")";
        case "notContains":
          return "contains(" + element + "," + val + ") eq false";
        case "startsWith":
          return "startswith(" + element + "," + val + ")";
        case "endsWith":
          return "endswith(" + element + "," + val + ")";
        case "equals":
        case "dateIs":
          return element + " eq " + val;
        case "notEquals":
        case "dateIsNot":
          return element + " ne " + val;
        case "gte":
          return element + " ge " + val;
        case "dateAfter":
          return element + " gt " + val;
        case "lte":
          return element + " le " + val;
        case "dateBefore":
          return element + " lt " + val;
        case undefined:
          return "";
  
        default:
          return element + " " + filter.matchMode + " " + val;
      }
    }
    //   checkValue(receivedData, queryFilters) {
    //     if (
    //       receivedData.value === null ||
    //       receivedData.value === "" ||
    //       receivedData.value === undefined
    //     ) {
    //       return;
    //     }
    //     queryFilters.push(this.setFilter(receivedData));
    //     return queryFilters;
    //   }
  }
  