import uvm_pkg::*;
`include "uvm_macros.svh"

class test extends uvm_test;
    `uvm_component_utils(test);
    function new(string name="test", uvm_component parent = null);
      super.new(name,parent);
    endfunction //new()
    function void build_phase(uvm_phase phase);
       super.build_phase(phase);
    endfunction //build_phase();
    task main_phase(uvm_phase phase);
        phase.raise_objection(this);
        main_test();
        phase.drop_objection(this);
    endtask //main_phase();
    extern task main_test();
endclass

task test::main_test();
    `uvm_info(get_name(),"MAIN_TEST start !",UVM_MEDIUM);

    `uvm_info(get_name(),"MAIN_TEST  end  !",UVM_MEDIUM);
endtask //main_testss //test extends uvm_test

module top_tb;
    initial begin
        run_test("test");
    end
endmodule