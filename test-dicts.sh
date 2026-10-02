#!/usr/bin/env sh
if ! command -v jq &>/dev/null; then
	echo "jq not installed"
	exit 1
fi
for file in docs/dict/*; do
	if [ -f "$file" ]; then
		echo -n "Testing: $file ... "
		if cat "$file" | jq -e . >/dev/null 2>/tmp/jqError; then
			echo -e "\e[32mok\e[0m"
		else
			echo -e "\e[31merror\e[0m: $(cat /tmp/jqError)"
		fi
	fi
done
rm -f /tmp/Error
