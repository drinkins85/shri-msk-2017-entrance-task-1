;(function(){

    let filters = document.querySelectorAll("[data-filter-type]");
    let filterArea = document.querySelector("[data-type=filtered-content]");
    for (let i=0; i<filters.length; i++){
        filters.item(i).addEventListener('change',scheduleFilter);
    }

    let resetButton = document.querySelector("[data-action=reset-filter]");
    resetButton.addEventListener('click', resetFilter);

    function scheduleFilter() {

        let selectedOpt = this.options.selectedIndex;
        let selectedVal = this.options[selectedOpt].value;
        let filterType = this.getAttribute('data-filter-type');
        resetButton.classList.remove("hidden");

        hideBySort("hide-by-"+filterType);

        if(selectedVal !== ''){
            let selector = "[data-type="+filterType+"]";
            let field = filterArea.querySelectorAll(selector);

            for (let i=0; i<field.length; i++){
                if (field[i].innerHTML.indexOf(selectedVal) >= 0 ){
                    field[i].closest('.schedule-table__row').classList.remove("hide-by-"+filterType);
                }
            }
        }
        else{
            showBySort("hide-by-"+filterType);
        }

    }

    function showBySort(hideClass){
        let hiddenRows = filterArea.querySelectorAll("."+hideClass);

        for (let i=0; i<hiddenRows.length; i++){
            hiddenRows.item(i).classList.remove(hideClass);
        }
    }

    function hideBySort(hideClass){
        let hiddenRows = filterArea.querySelectorAll('.schedule-table__row');
        for (let i=0; i<hiddenRows.length; i++){
            hiddenRows.item(i).classList.add(hideClass);
        }
    }

    function resetFilter() {
        for (let i=0; i<filters.length; i++){
            filters.item(i).options.selectedIndex = 0;
            showBySort("hide-by-"+filters[i].getAttribute('data-filter-type'));
        }
        resetButton.classList.add("hidden");

    }

})();