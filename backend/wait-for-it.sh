#!/usr/bin/env bash
# Utilitza bash com a intèrpret de comandes
# Utilitza aquest script per comprovar si un host/port TCP està disponible

WAITFORIT_cmdname=${0##*/}

echoerr() { if [[ $WAITFORIT_QUIET -ne 1 ]]; then echo "$@" 1>&2; fi } # Funció per imprimir missatges d'error a stderr.

usage()
{
    cat << USAGE >&2
Ús:
    $WAITFORIT_cmdname host:port [-s] [-t timeout] [-- command args]
    -h HOST | --host=HOST       Host o IP a provar
    -p PORT | --port=PORT       Port TCP a provar
                                Alternativament, pots especificar l'host i el port com a host:port
    -s | --strict               Executa la subcomanda només si la prova té èxit
    -q | --quiet                No mostra cap missatge d'estat
    -t TIMEOUT | --timeout=TIMEOUT
                                Temps d'espera en segons, zero per a cap temps d'espera
    -- COMMAND ARGS             Executa la comanda amb arguments un cop finalitzada la prova
USAGE
    exit 1
}

wait_for()
{
    if [[ $WAITFORIT_TIMEOUT -gt 0 ]]; then
        echoerr "$WAITFORIT_cmdname: esperant $WAITFORIT_TIMEOUT segons per $WAITFORIT_HOST:$WAITFORIT_PORT"
    else
        echoerr "$WAITFORIT_cmdname: esperant $WAITFORIT_HOST:$WAITFORIT_PORT sense temps d'espera"
    fi
    WAITFORIT_start_ts=$(date +%s)
    while :
    do
        if [[ $WAITFORIT_ISBUSY -eq 1 ]]; then
            nc -z $WAITFORIT_HOST $WAITFORIT_PORT
            WAITFORIT_result=$?
        else
            (echo -n > /dev/tcp/$WAITFORIT_HOST/$WAITFORIT_PORT) >/dev/null 2>&1
            WAITFORIT_result=$?
        fi
        if [[ $WAITFORIT_result -eq 0 ]]; then
            WAITFORIT_end_ts=$(date +%s)
            echoerr "$WAITFORIT_cmdname: $WAITFORIT_HOST:$WAITFORIT_PORT està disponible després de $((WAITFORIT_end_ts - WAITFORIT_start_ts)) segons"
            break
        fi
        sleep 1
    done
    return $WAITFORIT_result
}

wait_for_wrapper()
{
    # Per donar suport a SIGINT durant el temps d'espera: http://unix.stackexchange.com/a/57692
    if [[ $WAITFORIT_QUIET -eq 1 ]]; then
        timeout $WAITFORIT_BUSYTIMEFLAG $WAITFORIT_TIMEOUT $0 --quiet --child --host=$WAITFORIT_HOST --port=$WAITFORIT_PORT --timeout=$WAITFORIT_TIMEOUT &
    else
        timeout $WAITFORIT_BUSYTIMEFLAG $WAITFORIT_TIMEOUT $0 --child --host=$WAITFORIT_HOST --port=$WAITFORIT_PORT --timeout=$WAITFORIT_TIMEOUT &
    fi
    WAITFORIT_PID=$!
    trap "kill -INT -$WAITFORIT_PID" INT
    wait $WAITFORIT_PID
    WAITFORIT_RESULT=$?
    if [[ $WAITFORIT_RESULT -ne 0 ]]; then
        echoerr "$WAITFORIT_cmdname: s'ha produït un temps d'espera després d'esperar $WAITFORIT_TIMEOUT segons per $WAITFORIT_HOST:$WAITFORIT_PORT"
    fi
    return $WAITFORIT_RESULT
}

# Processa els arguments
while [[ $# -gt 0 ]]
do
    case "$1" in
        *:* )
        WAITFORIT_hostport=(${1//:/ })
        WAITFORIT_HOST=${WAITFORIT_hostport[0]}
        WAITFORIT_PORT=${WAITFORIT_hostport[1]}
        shift 1
        ;;
        --child)
        WAITFORIT_CHILD=1
        shift 1
        ;;
        -q | --quiet)
        WAITFORIT_QUIET=1
        shift 1
        ;;
        -s | --strict)
        WAITFORIT_STRICT=1
        shift 1
        ;;
        -h)
        WAITFORIT_HOST="$2"
        if [[ $WAITFORIT_HOST == "" ]]; then break; fi
        shift 2
        ;;
        --host=*)
        WAITFORIT_HOST="${1#*=}"
        shift 1
        ;;
        -p)
        WAITFORIT_PORT="$2"
        if [[ $WAITFORIT_PORT == "" ]]; then break; fi
        shift 2
        ;;
        --port=*)
        WAITFORIT_PORT="${1#*=}"
        shift 1
        ;;
        -t)
        WAITFORIT_TIMEOUT="$2"
        if [[ $WAITFORIT_TIMEOUT == "" ]]; then break; fi
        shift 2
        ;;
        --timeout=*)
        WAITFORIT_TIMEOUT="${1#*=}"
        shift 1
        ;;
        --)
        shift
        WAITFORIT_CLI=("$@")
        break
        ;;
        --help)
        usage
        ;;
        *)
        echoerr "Argument desconegut: $1"
        usage
        ;;
    esac
done

if [[ "$WAITFORIT_HOST" == "" || "$WAITFORIT_PORT" == "" ]]; then
    echoerr "Error: has de proporcionar un host i un port per provar."
    usage
fi

WAITFORIT_TIMEOUT=${WAITFORIT_TIMEOUT:-15}
WAITFORIT_STRICT=${WAITFORIT_STRICT:-0}
WAITFORIT_CHILD=${WAITFORIT_CHILD:-0}
WAITFORIT_QUIET=${WAITFORIT_QUIET:-0}

# Comprova si el temps d'espera és de busybox?
WAITFORIT_TIMEOUT_PATH=$(type -p timeout)
WAITFORIT_TIMEOUT_PATH=$(realpath $WAITFORIT_TIMEOUT_PATH 2>/dev/null || readlink -f $WAITFORIT_TIMEOUT_PATH)

WAITFORIT_BUSYTIMEFLAG=""
if [[ $WAITFORIT_TIMEOUT_PATH =~ "busybox" ]]; then
    WAITFORIT_ISBUSY=1
    # Comprova si el temps d'espera de busybox utilitza la bandera -t
    # (les versions recents d'Alpine ja no admeten -t)
    if timeout &>/dev/stdout | grep -q -e '-t '; then
        WAITFORIT_BUSYTIMEFLAG="-t"
    fi
else
    WAITFORIT_ISBUSY=0
fi

if [[ $WAITFORIT_CHILD -gt 0 ]]; then
    wait_for
    WAITFORIT_RESULT=$?
    exit $WAITFORIT_RESULT
else
    if [[ $WAITFORIT_TIMEOUT -gt 0 ]]; then
        wait_for_wrapper
        WAITFORIT_RESULT=$?
    else
        wait_for
        WAITFORIT_RESULT=$?
    fi
fi

if [[ $WAITFORIT_CLI != "" ]]; then
    if [[ $WAITFORIT_RESULT -ne 0 && $WAITFORIT_STRICT -eq 1 ]]; then
        echoerr "$WAITFORIT_cmdname: mode estricte, rebutjant executar el subprocés"
        exit $WAITFORIT_RESULT
    fi
    exec "${WAITFORIT_CLI[@]}"
else
    exit $WAITFORIT_RESULT
fi
