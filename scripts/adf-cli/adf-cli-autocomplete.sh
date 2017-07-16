#!/usr/bin/env bash
# http://davidalger.com/development/bash-completion-on-os-x-with-brew/
# https://debian-administration.org/article/316/An_introduction_to_bash_completion_part_1
# https://debian-administration.org/article/317/An_introduction_to_bash_completion_part_2

# Possible commands:
# adf help
# adf ls
# adf[f][f] demo [gitjsapi commit-ish]
# adf[f][f] dir [component name without prefix | demo | script]
# adf[f][f] build [component name without prefix] [gitjsapi commit-ish]
# adf[f][f] test [component name without prefix] [gitjsapi commit-ish]
# adf[f][f] debug [component name without prefix] [gitjsapi commit-ish]

CLIDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
. $CLIDIR/.cli-variables

_adf()
{
    . $CLIDIR/.cli-variables
    local cur prev commands
    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"

    # Available commands
    commands="help list demo build test debug dir"

    case "${prev}" in
        list|build|test|debug)
            COMPREPLY=( $(compgen -W "${COMPONENTS[*]// /|}" -- ${cur}) )
            return 0
            ;;
        dir)
            COMPREPLY=( $(compgen -W "${COMPONENTS[*]// /|} $SCRIPTS $DEMOSHELL $COMPONENTS_DIRNAME" -- ${cur}) )
            return 0
            ;;
        *)
        ;;
    esac

    if [[ $COMP_CWORD == 1 ]]
    then
        COMPREPLY=($(compgen -W "${commands}" -- ${cur}))
    fi

    return 0
}
complete -F _adf adf
complete -F _adf adff
complete -F _adf adfff

# Aliases... Aliases everywhere...

# adff and adfff
eval 'alias adf="export SPEED=0; adf-cli "$@""'
eval 'alias adff="export SPEED=1; adf-cli "$@""'
eval 'alias adfff="export SPEED=2; adf-cli "$@""'

#  Main directories
eval 'alias adf$SCRIPTS="echo Entering `adf dir $SCRIPTS`; cd `adf dir $SCRIPTS`"'
eval 'alias adf$COMPONENTS_DIRNAME="echo Entering `adf dir $COMPONENTS_DIRNAME`; cd `adf dir $COMPONENTS_DIRNAME`"'
eval 'alias adf$DEMOSHELL="echo Entering `adf dir $DEMOSHELL`; cd `adf dir $DEMOSHELL`"'

# Components
for component in "${COMPONENTS[@]}"
do
    eval 'alias adf$component="echo Entering `adf dir $component`; cd `adf dir $component`"'
done

