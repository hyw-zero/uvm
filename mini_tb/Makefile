TB = ./uvm_test.sv
SEED ?= $(shell date +%s)

VCS = /opt/synopsys/vcs/vcs-mx/O-2018.09-SP2/bin/vcs

all:compile simulate clean

compile:
	$(VCS) -full64 +vcs+lic+wait -sverilog -debug_access+all -lca -kdb -timescale=1ns/1ns -ntb_opts uvm-1.2 $(TB) -l com.log

simulate:
	./simv +ntb_random_seed=$(SEED) -l sim.log

clean:
	rm -rf csrc simv* *.key *.vpd DVEfilrs coverage *vdb vc_hdrs* verdi*